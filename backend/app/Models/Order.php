<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_name',
        'client_email',
        'client_phone',
        'client_address',
        'total_price',
        'payment_method',
        'status'
    ];

    // An Order has many OrderElements
    public function orderElements()
    {
        return $this->hasMany(OrderElement::class);
    }
}
