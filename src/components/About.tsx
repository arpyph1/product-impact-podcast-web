import { CMSContent } from "@/types/cms";

interface AboutProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

export default function About({ content, isEditing, onUpdate }: AboutProps) {
  return (
    <section id="about" className="bg-background">
      <div className="container mx-auto px-6">

        {/* Editorial layout: [About Us] label left, big text right — NO title */}
        <div className="grid md:grid-cols-[200px_1fr] gap-12 py-16 items-start">
          <div className="pt-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border border-border rounded-full px-3 py-1 inline-block">
              [About Us]
            </p>
          </div>
          <div>
            {/* Body text 50% larger than base */}
            <p
              className="text-muted-foreground leading-relaxed max-w-2xl mb-8"
              style={{ fontSize: "1.5rem", lineHeight: "1.6" }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("aboutDescription", e.currentTarget.textContent || "")}
            >
              {content.aboutDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full border border-border text-muted-foreground"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={e => {
                    if (!isEditing) return;
                    const newTags = [...content.tags];
                    newTags[idx] = e.currentTarget.textContent || tag;
                    onUpdate("tags", newTags);
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
