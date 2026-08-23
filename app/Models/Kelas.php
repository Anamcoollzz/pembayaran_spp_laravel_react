<?php

namespace App\Models;

use Database\Factories\KelasFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    /** @use HasFactory<KelasFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'nama_kelas',
        'kompetensi_keahlian',
        'tingkat',
    ];

    /**
     * @return HasMany<Siswa, $this>
     */
    public function siswas(): HasMany
    {
        return $this->hasMany(Siswa::class);
    }
}
