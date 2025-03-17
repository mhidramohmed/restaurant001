<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiscountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "discount_percentage" => $this->discount_percentage,
            "expires_at" => $this->expires_at,
            "is_active" => $this->is_active,
            "image" => $this->image ? url("/storage/images/" . $this->image) : null, // Discount image
            "menu_item" => $this->menuItem
                ? [
                    "id" => $this->menuItem->id,
                    "name" => $this->menuItem->name,
                    'price'=>$this->price,
                    "image" => url("/storage/images/" . $this->menuItem->image),
                ]
                : null,
        ];
    }
}
