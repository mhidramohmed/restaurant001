<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $fillable = ['name','image'];

    // protected $appends = ['image_url'];

    // protected $hidden = ['image'];




    // A Category has many Menu Items
    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }


    // public function getImageUrlAttribute()
    // {
    //     if ($this->image) {
    //         return url($this->image); // Assumes images are stored in the "storage/app/public" directory
    //     }
    //     return null; // Return null if no image is set
    // }
}
