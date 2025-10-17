"use client";

import { ScatterplotLayer } from "@deck.gl/layers";
import { DeckGL } from "@deck.gl/react";
import { Map as MapLibre } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  transitionDuration?: number;
}

export const DeckGLMap = () => {
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 139.7671,
    latitude: 35.6812,
    zoom: 11,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null,
  );

  // 検索処理（OpenStreetMap Nominatim APIを使用）
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery,
        )}&limit=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lon, lat } = data[0];
        const longitude = parseFloat(lon);
        const latitude = parseFloat(lat);

        // カメラを移動
        setViewState({
          longitude,
          latitude,
          zoom: 14,
          transitionDuration: 1000, // 1秒かけて移動
        });

        // マーカーを設置
        setMarkerPosition([longitude, latitude]);
      } else {
        alert("検索結果が見つかりませんでした");
      }
    } catch (error) {
      console.error("検索エラー:", error);
      alert("検索中にエラーが発生しました");
    } finally {
      setIsSearching(false);
    }
  };

  const layers = [
    markerPosition &&
      new ScatterplotLayer({
        id: "search-marker",
        data: [{ position: markerPosition }],
        getPosition: (d) => d.position,
        getFillColor: [255, 0, 0, 200],
        getRadius: 100,
        radiusMinPixels: 8,
        radiusMaxPixels: 50,
      }),
  ].filter(Boolean);

  return (
    <div className="relative w-full h-screen">
      {/* 検索UI */}
      <div className="absolute top-5 left-5 z-10 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="地名や住所を入力..."
          disabled={isSearching}
          className="px-4 py-3 text-sm border-none rounded-lg shadow-md w-[300px] outline-none bg-gray-100 disabled:bg-white"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="px-6 py-3 text-sm border-none rounded-lg text-white font-medium shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed enabled:bg-green-500 enabled:hover:bg-green-600 enabled:cursor-pointer"
        >
          {isSearching ? "検索中..." : "検索"}
        </button>
      </div>
      {/* 地図 */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) =>
          setViewState(viewState as ViewState)
        }
        controller
        layers={layers}
      >
        <MapLibre mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
      </DeckGL>
    </div>
  );
};
