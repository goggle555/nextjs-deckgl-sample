"use client";

import { DeckGL } from "@deck.gl/react";
import { Map as MapLibre } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { IconLayer } from "@deck.gl/layers";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  transitionDuration?: number;
};

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
        toast.error("検索結果が見つかりませんでした");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      toast.error("検索中にエラーが発生しました");
    } finally {
      setIsSearching(false);
    }
  };

  const layers = [
    markerPosition &&
      new IconLayer({
        id: "search-marker",
        data: [{ position: markerPosition }],
        getPosition: (d) => d.position,
        getIcon: () => ({
          url:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 2C15.163 2 8 9.163 8 18c0 13.5 16 28 16 28s16-14.5 16-28c0-8.837-7.163-16-16-16z" 
                    fill="#EF4444" stroke="#991B1B" stroke-width="2"/>
              <circle cx="24" cy="18" r="6" fill="white"/>
            </svg>
          `),
          width: 48,
          height: 48,
          anchorY: 48,
        }),
        getSize: 48,
        sizeScale: 1,
        pickable: true,
      }),
  ].filter(Boolean);

  return (
    <div className="relative w-dvw h-dvh">
      <Toaster />
      {/* 検索UI */}
      <div className="absolute top-5 left-5 z-10 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.key !== "Enter") return;
            handleSearch();
          }}
          placeholder="地名や住所を入力..."
          disabled={isSearching}
          className={
            "px-4 py-3 text-sm border-none rounded-lg shadow-md w-[300px] outline-none " +
            "bg-gray-100 disabled:bg-white"
          }
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className={
            "px-6 py-3 text-sm border-none rounded-lg text-white font-medium " +
            "shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed " +
            "enabled:bg-green-500 enabled:hover:bg-green-600 enabled:cursor-pointer"
          }
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
