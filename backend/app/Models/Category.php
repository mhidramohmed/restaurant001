<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $fillable = ['name','image','is_deleted'];



    // A Category has many Menu Items
    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }
}
