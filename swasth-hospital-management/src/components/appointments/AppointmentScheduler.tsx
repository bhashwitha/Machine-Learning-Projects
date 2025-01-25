import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Calendar from 'react-calendar';
import type { Value } from 'react-calendar/dist/cjs/shared/types';
import 'react-calendar/dist/Calendar.css';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentData {
  date: Date;
  time: string;
  type: 'in-person' | 'video';
}

const AppointmentScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'in-person' | 'video'>('in-person');
  const queryClient = useQueryClient();

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const { data: timeSlots } = useQuery({
    queryKey: ['timeSlots', selectedDate.toISOString()],
    queryFn: () => 
      fetch(`/api/appointments/available-slots?date=${selectedDate.toISOString()}`)
        .then(res => res.json()) as Promise<TimeSlot[]>
  });

  const createAppointment = useMutation({
    mutationFn: (appointmentData: AppointmentData) =>
      fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const handleSchedule = () => {
    createAppointment.mutate({
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
    });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Schedule Appointment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
            className="rounded-lg border p-2"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Available Time Slots</h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots?.map((slot: TimeSlot) => (
                <button
                  key={slot.time}
                  onClick={() => setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-2 rounded ${
                    selectedTime === slot.time
                      ? 'bg-blue-500 text-white'
                      : slot.available
                      ? 'bg-gray-100 hover:bg-gray-200'
                      : 'bg-gray-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Appointment Type</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedType('in-person')}
                className={`px-4 py-2 rounded ${
                  selectedType === 'in-person'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                In-Person
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`px-4 py-2 rounded ${
                  selectedType === 'video'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Video Call
              </button>
            </div>
          </div>

          <button
            onClick={handleSchedule}
            disabled={!selectedTime}
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Schedule Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler; 