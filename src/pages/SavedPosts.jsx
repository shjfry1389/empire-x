import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";

export default function SavedPosts() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadSavedPosts = async (pageNumber = 1, reset = false) => {
    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("برای دیدن پست‌های ذخیره‌شده اول وارد شوید");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get("/api/saved-posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: pageNumber,
          limit: 15,
        },
      });

      const newPosts = Array.isArray(res.data) ? res.data : [];

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length === 15);
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      alert("خطا در دریافت پست‌های ذخیره‌شده");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedPosts(1, true);
  }, []);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        background: "#fff",
        minHeight: "100vh",
        borderLeft: "1px solid #eff3f4",
        borderRight: "1px solid #eff3f4",
        paddingBottom: "90px",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#fff",
          padding: "16px 20px",
          borderBottom: "1px solid #eff3f4",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "22px",
            color: "#0f172a",
          }}
        >
          ←
        </button>

        <div>
          <h2 style={{ margin: 0 }}>پست‌های ذخیره‌شده</h2>
          <p style={{ margin: "4px 0 0", color: "#536471", fontSize: "14px" }}>
            پست‌هایی که ذخیره کرده‌اید
          </p>
        </div>
      </div>

      {posts.length === 0 && !loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "70px 20px",
            color: "#536471",
          }}
        >
          <h3>هنوز پستی ذخیره نکرده‌اید</h3>
          <p>هر پستی را ذخیره کنید، اینجا نمایش داده می‌شود.</p>

          <Link
            to="/"
            style={{
              display: "inline-block",
              marginTop: "15px",
              background: "#1d9bf0",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "999px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            رفتن به صفحه اصلی
          </Link>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}

      {hasMore && posts.length > 0 && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <button
            onClick={() => loadSavedPosts(page + 1)}
            disabled={loading}
            style={{
              border: "none",
              background: loading ? "#93c5fd" : "#1d9bf0",
              color: "#fff",
              padding: "11px 24px",
              borderRadius: "999px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "در حال دریافت..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}