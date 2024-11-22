<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

     protected $fillable = ['name', 'description', 'price', 'image', 'category_id'];

    // A MenuItem belongs to a Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // get link of image
    // public function getImageAttribute($value){
    //     $actual_link = (isset($_SERVER['HTTPS']) ? 'https' :'http') . '://'.$_SERVER['HTTP_HOST'] . '/';
    //     return ($value == null?'' : $actual_link .  'MenuItemsImages/' . $value);
    // }

    // A MenuItem has many OrderElements
    public function orderElements()
    {
        return $this->hasMany(OrderElement::class);
    }
}
