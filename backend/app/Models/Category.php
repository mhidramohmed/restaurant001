<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    use HasFactory;

    protected $fillable = ['name','image', 'description'];

    public function getImageAttribute($value){
        $actual_link = (isset($_SERVER['HTTPS']) ? 'https' :'http') . '://'.$_SERVER['HTTP_HOST'] . '/';
        return ($value == null?'' : $actual_link .  'CategoriesImages/' . $value);
    }

    // A Category has many Menu Items
    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }
}
