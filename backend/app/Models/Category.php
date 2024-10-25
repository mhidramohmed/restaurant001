<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    use HasFactory;

    protected $fillable = ['name','image', 'description'];

    // A Category has many Menu Items
    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }
}
