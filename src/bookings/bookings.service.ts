import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTimeSlotDto } from "./dto/booking.dto";

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createTimeSlot(doctorId: string, createTimeSlotDto: CreateTimeSlotDto) {
    const { startTime, endTime } = createTimeSlotDto;

    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId, role: "Doctor" },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    return this.prisma.timeSlot.create({
      data: {
        doctorId,
        startTime,
        endTime,
      },
    });
  }

  async getAllDoctors() {
    return this.prisma.user.findMany({
      where: { role: "Doctor" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async getAvailableTimeSlots(doctorId: string) {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId, role: "Doctor" },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    return this.prisma.timeSlot.findMany({
      where: {
        doctorId,
        isBooked: false,
        startTime: { gt: new Date() },
      },
    });
  }

  async bookAppointment(patientId: string, timeSlotId: string) {
    const timeSlot = await this.prisma.timeSlot.findUnique({
      where: { id: timeSlotId, isBooked: false },
    });

    if (!timeSlot) {
      throw new NotFoundException("Time slot not available");
    }

    return this.prisma.$transaction(async (prisma) => {
      await prisma.timeSlot.update({
        where: { id: timeSlotId },
        data: { isBooked: true },
      });

      return prisma.booking.create({
        data: {
          patientId,
          timeSlotId,
        },
      });
    });
  }
}
