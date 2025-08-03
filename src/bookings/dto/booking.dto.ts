export class CreateTimeSlotDto {
  startTime: Date;
  endTime: Date;
}

export class BookAppointmentDto {
  timeSlotId: string;
}
