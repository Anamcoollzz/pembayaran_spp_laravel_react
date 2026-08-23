<?php

namespace App\Models;

use Database\Factories\SiswaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Siswa extends Model
{
    /** @use HasFactory<SiswaFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'nisn',
        'nis',
        'nama',
        'jenis_kelamin',
        'kelas_id',
        'spp_id',
        'alamat',
        'no_telp',
    ];

    /**
     * @return BelongsTo<Kelas, $this>
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * @return BelongsTo<Spp, $this>
     */
    public function spp(): BelongsTo
    {
        return $this->belongsTo(Spp::class);
    }

    /**
     * @return HasMany<PembayaranSpp, $this>
     */
    public function pembayaranSpps(): HasMany
    {
        return $this->hasMany(PembayaranSpp::class);
    }
}
