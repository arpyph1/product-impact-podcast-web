import { useState } from "react";
import { useCMS } from "@/hooks/useCMS";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import { useAuth } from "@/hooks/useAuth";
import { ArrowUpRight, Star } from "lucide-react";
import { AI_PRODUCTS } from "@/data/aiProducts";

const ITEMS_PER_PAGE = 25;

function StarRating({ rateUrl }: { rateUrl: string }) {
  return (
    <a
      href={rateUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 group"
    >
      <span className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
        ))}
      </span>
      <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
        rate me
      </span>
    </a>
  );
}

export default function Products() {
  const { content, update, isEditing, setIsEditing } = useCMS();
  const { user, canEdit, signInWithGoogle, signOut } = useAuth();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(AI_PRODUCTS.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const visible = AI_PRODUCTS.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeadMeta content={content} />
      <Navbar
        content={content}
        isEditing={isEditing}
        onToggleEdit={() => canEdit ? setIsEditing(v => !v) : signInWithGoogle()}
        onContactClick={() => {}}
        onUpdate={update}
        canEdit={canEdit}
        user={user}
        onSignIn={signInWithGoogle}
        onSignOut={signOut}
      />

      <main className="pt-28 pb-20 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            200 Exciting AI-Native Products for Product Teams
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.productsHeading || "Tell us about the AI products you use most"}
          </p>
          {content.productsButtonText && (
            <a
              href={content.productsButtonUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {content.productsButtonText}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-8">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Use Case</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">What's Unique</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Rating</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p, i) => (
                  <tr key={p.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{start + i + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                      >
                        {p.name}
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.unique}</td>
                    <td className="px-4 py-3">
                      <StarRating rateUrl={content.productsRateUrl || ""} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Showing {start + 1}–{Math.min(start + ITEMS_PER_PAGE, AI_PRODUCTS.length)} of {AI_PRODUCTS.length} products
        </p>
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => {}} />
    </div>
  );
}
