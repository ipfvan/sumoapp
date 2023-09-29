import { formatTanggal, formatJam } from '../../utils/LocalDateTime';

function generateMessage(tanggal, availableTime, configData, specialConfigData) {
    const currentDate = new Date();
    const currentTime = currentDate.toTimeString().slice(0, 5);

    const maxRegistrationTime = specialConfigData.jam_tutup_sp || configData.jam_tutup;
    const breakStartTime = specialConfigData.jam_break_sp || configData.jam_break;
    const breakEndTime = specialConfigData.jam_break_akhir_sp || configData.jam_break_akhir;

    if (tanggal === currentDate.toISOString().split('T')[0] && availableTime < currentTime) {
        return 'Untuk daftar dadakan di hari ini, silakan hubungi admin lewat WhatsApp ya';
    } 
    else if (new Date(tanggal) < currentDate) {
      return 'Tanggal yang Anda pilih sudah lewat.';
  } else if (availableTime >= maxRegistrationTime) {
        return `Maaf, waktu pendaftaran untuk tanggal ${formatTanggal(tanggal)} telah habis, silahkan pilih tanggal lainnya.`;
    } else if (availableTime >= breakStartTime && availableTime < breakEndTime) {
        return `Jam yang tersedia pada tanggal ${formatTanggal(tanggal)} adalah jam ${formatJam(breakEndTime)}.`;
    } else {
        return `Jam yang tersedia pada tanggal ${formatTanggal(tanggal)} adalah jam ${formatJam(availableTime)}.`;
    }
}

export default generateMessage;
