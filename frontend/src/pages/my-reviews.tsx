import { useEffect, useState } from "react";
import MapComponent from "../components/MapPopup";

const API = "http://localhost:8000";

export default function MyReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReview, setSelectedReview] = useState<number | null>(null);

  // 🔥 state เดิมของคุณ (ไม่ลบ)
  const [editing, setEditing] = useState<any>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  const loadReviews = () => {
    fetch(`${API}/reviews/my/list`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("กรุณาเข้าสู่ระบบก่อน");
          }
          throw new Error("โหลดข้อมูลไม่สำเร็จ");
        }
        return res.json();
      })
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const deleteReview = async (id: number) => {
    if (!confirm("คุณต้องการลบรีวิวนี้หรือไม่?")) return;

    await fetch(`${API}/reviews/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    loadReviews();
  };

  const saveEdit = async () => {
    await fetch(`${API}/reviews/${editing.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        review_text: editText,
        rating: editRating,
      }),
    });

    setEditing(null);
    loadReviews();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        กำลังโหลด...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-red-400">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-20">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-12">
          ประวัติการรีวิวของฉัน
        </h1>

        {reviews.length === 0 && (
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 text-center border border-gray-700">
            ยังไม่มีรีวิว
          </div>
        )}

        {reviews.map((r: any) => (
          <div
            key={r.id}
            className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 mb-10 shadow-xl border border-gray-700 transition hover:scale-[1.01]"
          >
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              {r.class_name}
            </h3>

            <p className="mb-3 text-yellow-400 text-lg">
              {"★".repeat(r.rating)}
            </p>

            <p className="text-gray-200 mb-3">
              {r.review_text}
            </p>

            <p className="text-xs text-gray-400 mb-6">
              {new Date(r.created_at).toLocaleString()}
            </p>

            {/* 🔥 ปุ่มจัดการ */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                className="px-4 py-2 rounded-full border border-green-400 text-green-400 hover:bg-green-500 hover:text-white transition"
                onClick={() => setSelectedReview(r.id)}
              >
                📍 ปักหมุดตลาด
              </button>

              <button
                className="px-4 py-2 rounded-full border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                onClick={() => {
                  setEditing(r);
                  setEditText(r.review_text);
                  setEditRating(r.rating);
                }}
              >
                ✏️ แก้ไข
              </button>

              <button
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 transition"
                onClick={() => deleteReview(r.id)}
              >
                🗑 ลบ
              </button>
            </div>

            {/* Static Map */}
            {r.latitude && r.longitude && (
              <>
                <img
                  className="rounded-2xl shadow-md border border-gray-700"
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${r.latitude},${r.longitude}&zoom=14&size=500x250&markers=color:red|${r.latitude},${r.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`}
                  alt="map"
                />

                <button
                  className="mt-4 px-5 py-2 rounded-full bg-green-600 hover:bg-green-700 transition"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${r.latitude},${r.longitude}`,
                      "_blank"
                    )
                  }
                >
                  นำทาง
                </button>
              </>
            )}
          </div>
        ))}

      </div>

      {/* 🔥 Map Popup */}
      {selectedReview && (
        <MapComponent
          reviewId={selectedReview}
          onClose={() => setSelectedReview(null)}
          onSaved={() => {
            setSelectedReview(null);
            loadReviews();
          }}
        />
      )}

      {/* 🔥 Edit Popup */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-3xl p-8 w-[500px] border border-gray-700 shadow-2xl">

            <h2 className="text-xl font-semibold mb-6 text-green-400">
              แก้ไขรีวิว
            </h2>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 mb-4 text-white"
            />

            <input
              type="number"
              min={1}
              max={5}
              value={editRating}
              onChange={(e) => setEditRating(Number(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 mb-6 text-white"
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-full border border-gray-400 hover:bg-gray-600 transition"
                onClick={() => setEditing(null)}
              >
                ยกเลิก
              </button>

              <button
                className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 transition"
                onClick={saveEdit}
              >
                บันทึก
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
