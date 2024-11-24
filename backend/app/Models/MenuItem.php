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


    // A MenuItem has many OrderElements
    public function orderElements()
    {
        return $this->hasMany(OrderElement::class);
    }
}
