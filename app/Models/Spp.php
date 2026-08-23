<?php

namespace App\Models;

use Database\Factories\SppFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Spp extends Model
{
    /** @use HasFactory<SppFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'spp';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'tahun',
        'nominal',
        'keterangan',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tahun' => 'integer',
            'nominal' => 'decimal:2',
        ];
    }

    /**
     * @return HasMany<Siswa, $this>
     */
    public function siswas(): HasMany
    {
        return $this->hasMany(Siswa::class);
    }
}
