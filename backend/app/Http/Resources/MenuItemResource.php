<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $newPrice = $this->discount
            ? $this->price - ($this->price * ($this->discount->discount_percentage / 100))
            : $this->price;

        return [
            "id"=>$this->id,
            "name"=>$this->name,
            "description"=>$this->description,
            'price'=>$this->price,
            'category_id'=>$this->category_id,
            'category'=>$this->category,
            "image"=>url("/storage/images".($this->image)),
            'discount' => $this->discount
                ? [
                    'discount_percentage' => $this->discount->discount_percentage,
                    'expires_at' => $this->discount->expires_at,
                    'is_active' => $this->discount->is_active,
                    "new_price" => round($newPrice, 2) // Add new price after discount
                  ]
                : null,

        ];
    }
}
