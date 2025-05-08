<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategorieResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array

    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "image" => url("/storage/images".($this->image)),
            "order" => $this->order,
            "menu_items" => $this->whenLoaded('menuItems', $this->menuItems),
            "menu_items_count" => $this->whenLoaded('menuItems', count($this->menuItems)),
        ];
    }

}
