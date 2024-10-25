<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderElement extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'menu_item_id', 'quantity', 'price'];

    // An OrderElement belongs to an Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // An OrderElement belongs to a MenuItem
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}
