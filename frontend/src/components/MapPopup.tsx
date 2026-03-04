import {
  GoogleMap,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

type Props = {
  reviewId: number;
  onClose: () => void;
  onSaved: () => void;
};

const API = "http://localhost:8000";

export default function MapComponent({
  reviewId,
  onClose,
  onSaved,
}: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries: ["marker"], // 🔥 สำคัญมากสำหรับ AdvancedMarker
  });

  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [placeName, setPlaceName] = useState("ตลาด");
  const [loading, setLoading] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const advancedMarkerRef =
    useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white px-8 py-6 rounded-2xl shadow-lg">
          กำลังโหลดแผนที่...
        </div>
      </div>
    );
  }

  const saveLocation = async () => {
    if (!markerPosition) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API}/reviews/${reviewId}/location`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: markerPosition.lat,
            longitude: markerPosition.lng,
            place_name: placeName,
          }),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("กรุณาเข้าสู่ระบบก่อน");
        }
        throw new Error("บันทึกตำแหน่งไม่สำเร็จ");
      }

      onSaved();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng || !mapRef.current) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarkerPosition({ lat, lng });

    // 🔥 ลบ marker เก่า
    if (advancedMarkerRef.current) {
      advancedMarkerRef.current.map = null;
    }

    // 🔥 สร้าง AdvancedMarker ใหม่
    advancedMarkerRef.current =
      new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat, lng },
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-[700px] max-w-[95%] rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-emerald-600 text-white px-8 py-5">
          <h2 className="text-xl font-semibold">
            📍 เลือกตำแหน่งสถานที่
          </h2>
          <p className="text-sm opacity-80">
            คลิกบนแผนที่เพื่อปักหมุด
          </p>
        </div>

        {/* Map */}
        <div className="p-6 space-y-5">
          <GoogleMap
            zoom={13}
            center={{ lat: 18.7883, lng: 98.9853 }}
            mapContainerStyle={{
              width: "100%",
              height: "400px",
            }}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            onClick={handleMapClick}
          />

          {/* Place Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              ชื่อสถานที่
            </label>
            <input
              type="text"
              value={placeName}
              onChange={(e) =>
                setPlaceName(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              placeholder="เช่น ตลาดบ้านแม่ริม"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            >
              ยกเลิก
            </button>

            {markerPosition && (
              <button
                onClick={saveLocation}
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-50"
              >
                {loading
                  ? "กำลังบันทึก..."
                  : "บันทึกตำแหน่ง"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
