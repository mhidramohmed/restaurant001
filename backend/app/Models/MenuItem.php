<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuItem extends Model
{
    use HasFactory;

    use SoftDeletes;


    protected $fillable = ['name', 'description', 'price', 'image', 'category_id','is_deleted'];

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
