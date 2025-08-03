import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "../users/entities/user.entity";
import { BookAppointmentDto, CreateTimeSlotDto } from "./dto/booking.dto";
import type { AuthenticatedRequest } from "src/types/express";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post("timeslots")
  @UseGuards(AuthGuard)
  @Roles(UserRole.DOCTOR)
  async createTimeSlot(
    @Req() req: AuthenticatedRequest,
    @Body() createTimeSlotDto: CreateTimeSlotDto
  ) {
    const doctorId = req.user.id;
    return this.bookingsService.createTimeSlot(doctorId, createTimeSlotDto);
  }

  @Get("doctors")
  @UseGuards(AuthGuard)
  async getAllDoctors() {
    return this.bookingsService.getAllDoctors();
  }

  @Get("timeslots/:doctorId")
  @UseGuards(AuthGuard)
  async getAvailableTimeSlots(@Param("doctorId") doctorId: string) {
    return this.bookingsService.getAvailableTimeSlots(doctorId);
  }

  @Post("book")
  @UseGuards(AuthGuard)
  @Roles(UserRole.PATIENT)
  async bookAppointment(
    @Req() req: AuthenticatedRequest,
    @Body() bookAppointmentDto: BookAppointmentDto
  ) {
    const patientId = req.user.id;
    return this.bookingsService.bookAppointment(
      patientId,
      bookAppointmentDto.timeSlotId
    );
  }
}
