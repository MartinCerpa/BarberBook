export const barber = {
  business: {
    name: 'BarberBook',
    location: 'Santiago, Chile',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Santiago%2C%20Chile',
    openingHours: {
      days: 'Lunes a sábado',
      time: '10:00 a 19:00',
    },
    bookingFee: 1000,
  },
  professional: {
    name: 'Matías',
    role: 'Barbero',
    bio: 'Cortes precisos, atención cercana y un espacio pensado para que cada visita se sienta personal.',
  },
  services: [
    {
      id: 'haircut',
      name: 'Corte de cabello',
      description: 'Corte personalizado y terminaciones cuidadas.',
      price: 12000,
      duration: 45,
    },
    {
      id: 'haircut-beard',
      name: 'Corte + barba',
      description: 'Servicio completo para renovar tu estilo.',
      price: 16000,
      duration: 60,
    },
    {
      id: 'beard',
      name: 'Barba',
      description: 'Perfilado, rebaje y acabado profesional.',
      price: 8000,
      duration: 30,
    },
  ],
}
