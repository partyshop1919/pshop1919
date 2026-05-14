import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadProductImage,
  BACKEND_URL
} from "../../lib/api";
import { useAdmin } from "../../lib/auth";

const CATEGORIES = [
  "Baloane latex",
  "Baloane cifre",
  "Baloane folie",
  "Ghirlande",
  "Confetti",
  "Bannere",
  "Pahare si farfurii",
  "Coifuri si accesorii",
  "uncategorized"
];

function resolveImage(image) {
  if (!image) return null;
  if (typeof image !== "string") return null;

  // imagini statice din frontend
  if (image.startsWith("/images")) return image;

  // uploads din backend
  if (image.startsWith("/uploads")) return `${BACKEND_URL}${image}`;

  // url complet
  if (image.startsWith("http")) return image;

  // fallback: tratează ca path relativ backend
  if (image.startsWith("/")) return `${BACKEND_URL}${image}`;

  return image;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { isLoggedIn: isAdmin, logoutAdmin } = useAdmin();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    priceCents: 0,
    stock: 0,
    image: "",
    images: "",
    category: "uncategorized",
    featured: false
  });

  // pentru edit inline (optional, dar util)
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({
    name: "",
    description: "",
    priceCents: 0,
    stock: 0,
    image: "",
    images: "",
    category: "uncategorized",
    featured: false
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push("/admin/login");
      return;
    }

    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminGetProducts();
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!active) return;
        setItems([]);
        setError("Nu pot încărca produsele.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [isAdmin, router]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) => String(p.name || "").toLowerCase().includes(s));
  }, [items, search]);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetProducts();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Nu pot reîncărca produsele.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleCreateImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const out = await adminUploadProductImage(file);
    setUploading(false);

    if (!out?.image) {
      setError(out?.error || "Upload failed.");
      return;
    }

    setForm((prev) => ({ ...prev, image: out.image }));
  }

  async function create(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      name: String(form.name || "").trim(),
      description: String(form.description || "").trim(),
      priceCents: Number(form.priceCents) || 0,
      stock: Number(form.stock) || 0,
      image: String(form.image || "").trim(),
      images: String(form.images || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      category: String(form.category || "uncategorized"),
      featured: Boolean(form.featured)
    };

    const res = await adminCreateProduct(payload);
    setSaving(false);

    if (!res?.ok) {
      setError(res?.error || "Nu am putut crea produsul.");
      return;
    }

    setForm({
      name: "",
      description: "",
      priceCents: 0,
      stock: 0,
      image: "",
      images: "",
      category: "uncategorized",
      featured: false
    });

    await reload();
  }

  function startEdit(p) {
    setEditingId(p.id);
    setEdit({
      name: p.name || "",
      description: p.description || "",
      priceCents: Number(p.priceCents) || 0,
      stock: Number(p.stock) || 0,
      image: p.image || "",
      images: Array.isArray(p.images) ? p.images.join(", ") : "",
      category: p.category || "uncategorized",
      featured: Boolean(p.featured)
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function updateEditField(e) {
    const { name, value, type, checked } = e.target;
    setEdit((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleEditImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const out = await adminUploadProductImage(file);
    setUploading(false);

    if (!out?.image) {
      setError(out?.error || "Upload failed.");
      return;
    }

    setEdit((prev) => ({ ...prev, image: out.image }));
  }

  async function saveEdit(productId) {
    setSaving(true);
    setError(null);
    console.log("SAVING ID:", productId);

    const payload = {
      name: String(edit.name || "").trim(),
      description: String(edit.description || "").trim(),
      priceCents: Number(edit.priceCents) || 0,
      stock: Number(edit.stock) || 0,
      image: String(edit.image || "").trim(),
      images: String(edit.images || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      category: String(edit.category || "uncategorized"),
      featured: Boolean(edit.featured)
    };

    const res = await adminUpdateProduct(productId, payload);
      console.log("UPDATE RESPONSE:", res);

    setSaving(false);

    if (!res?.ok) {
      setError(res?.error || "Nu am putut salva produsul.");
      return;
    }

    setEditingId(null);
    await reload();
  }

  async function toggleFeatured(p) {
    setSaving(true);
    setError(null);
    const res = await adminUpdateProduct(p.id, { featured: !p.featured });
    setSaving(false);

    if (!res?.ok) setError(res?.error || "Nu pot actualiza featured.");
    await reload();
  }

  async function remove(p) {
    if (!confirm(`Ștergi produsul: ${p.name}?`)) return;
    setSaving(true);
    setError(null);
    const res = await adminDeleteProduct(p.id);
    setSaving(false);

    if (!res?.ok) setError(res?.error || "Nu pot șterge produsul.");
    await reload();
  }

  if (!isAdmin) return null;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <h1>Admin Products</h1>
        <button className="btn" onClick={logoutAdmin}>Logout Admin</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ margin: "16px 0" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{ width: "100%", padding: 10 }}
        />
      </div>

      <h2>Adaugă produs</h2>
      <form onSubmit={create} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <input name="name" value={form.name} onChange={updateField} placeholder="Name" required />
        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          placeholder="Descriere produs"
          rows={3}
        />

        <input
          name="priceCents"
          value={form.priceCents}
          onChange={updateField}
          placeholder="Price cents"
          type="number"
          min="0"
          required
        />

        <input
          name="stock"
          value={form.stock}
          onChange={updateField}
          placeholder="Stock"
          type="number"
          min="0"
        />

        {/* ✅ UPLOAD + PREVIEW */}
        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontWeight: 600 }}>Upload imagine</label>
          <input type="file" accept="image/*" onChange={handleCreateImageFile} />
          {uploading && <div>Uploading...</div>}

          <input
            name="image"
            value={form.image}
            onChange={updateField}
            placeholder="Image path (/uploads/... sau /images/...)"
          />

          <input
            name="images"
            value={form.images}
            onChange={updateField}
            placeholder="Imagini extra (max 2), separate prin virgula"
          />

          {resolveImage(form.image) && (
            <img
              src={resolveImage(form.image)}
              alt="preview"
              style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 10, border: "1px solid #333" }}
            />
          )}
        </div>

        <select name="category" value={form.category} onChange={updateField}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" name="featured" checked={form.featured} onChange={updateField} />
          Featured
        </label>

        <button className="btn" disabled={saving || uploading}>
          {saving ? "Saving..." : "Create"}
        </button>
      </form>

      <hr style={{ margin: "24px 0" }} />

      <h2>Produse</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((p) => {
            const isEditing = editingId === p.id;
            const img = resolveImage(isEditing ? edit.image : p.image);

            return (
              <div key={p.id} style={{ border: "1px solid #333", padding: 12, borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 90 }}>
                      {img ? (
                        <img
                          src={img}
                          alt={p.name}
                          style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10, border: "1px solid #333" }}
                        />
                      ) : (
                        <div style={{ width: 90, height: 90, borderRadius: 10, border: "1px solid #333" }} />
                      )}
                    </div>

                    {!isEditing ? (
                      <div>
                        <strong>{p.name}</strong>
                        <div>{(p.priceCents / 100).toFixed(2)} RON</div>
                        <div>Stock: {p.stock}</div>
                        <div>Category: {p.category}</div>
                        <div>Featured: {String(p.featured)}</div>
                        <div style={{ maxWidth: 560, color: "var(--secondary)" }}>
                          Descriere: {p.description || "-"}
                        </div>
                        <div style={{ opacity: 0.8, wordBreak: "break-all" }}>Image: {p.image || "-"}</div>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: 8, minWidth: 340 }}>
                        <input name="name" value={edit.name} onChange={updateEditField} />
                        <textarea
                          name="description"
                          rows={3}
                          value={edit.description}
                          onChange={updateEditField}
                          placeholder="Descriere produs"
                        />
                        <input name="priceCents" type="number" min="0" value={edit.priceCents} onChange={updateEditField} />
                        <input name="stock" type="number" min="0" value={edit.stock} onChange={updateEditField} />

                        <select name="category" value={edit.category} onChange={updateEditField}>
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>

                        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input type="checkbox" name="featured" checked={edit.featured} onChange={updateEditField} />
                          Featured
                        </label>

                        <div style={{ display: "grid", gap: 6 }}>
                          <input type="file" accept="image/*" onChange={handleEditImageFile} />
                          <input name="image" value={edit.image} onChange={updateEditField} />
                          <input
                            name="images"
                            value={edit.images}
                            onChange={updateEditField}
                            placeholder="Imagini extra (max 2), separate prin virgula"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
                    {!isEditing ? (
                      <>
                        <button className="btn" type="button" onClick={() => startEdit(p)} disabled={saving || uploading}>
                          Edit
                        </button>

                        <button className="btn" type="button" onClick={() => toggleFeatured(p)} disabled={saving || uploading}>
                          Toggle Featured
                        </button>

                        <button className="btn" type="button" onClick={() => remove(p)} disabled={saving || uploading}>
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn" type="button" onClick={() => saveEdit(p.id)} disabled={saving || uploading}>
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button className="btn" type="button" onClick={cancelEdit} disabled={saving || uploading}>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
