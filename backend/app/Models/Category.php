<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $fillable = ['name','image','order'];

    // protected $appends = ['image_url'];

    // protected $hidden = ['image'];




    // A Category has many Menu Items
    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }



    protected static function boot()
    {
        parent::boot();

        static::created(function ($category) {
            $category->order = $category->id;
            $category->save();
        });
    }


}
