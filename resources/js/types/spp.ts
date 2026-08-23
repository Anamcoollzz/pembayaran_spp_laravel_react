import type { User } from './auth';

export type Kelas = {
    id: number;
    nama_kelas: string;
    kompetensi_keahlian: string;
    tingkat: string;
    siswas_count?: number;
    created_at?: string;
    updated_at?: string;
};

export type Spp = {
    id: number;
    tahun: number;
    nominal: number | string;
    keterangan?: string | null;
    siswas_count?: number;
    created_at?: string;
    updated_at?: string;
};

export type Siswa = {
    id: number;
    nisn: string;
    nis: string;
    nama: string;
    jenis_kelamin: 'L' | 'P';
    kelas_id: number;
    spp_id?: number | null;
    alamat?: string | null;
    no_telp?: string | null;
    kelas?: Kelas;
    spp?: Spp | null;
    created_at?: string;
    updated_at?: string;
};

export type PembayaranSpp = {
    id: number;
    kode_transaksi: string;
    user_id: number;
    siswa_id: number;
    tanggal_bayar: string;
    bulan_dibayar: string;
    tahun_dibayar: number;
    jumlah_bayar: number | string;
    metode_pembayaran: string;
    catatan?: string | null;
    siswa?: Siswa;
    user?: User;
    created_at?: string;
    updated_at?: string;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};
