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
        {/* Editorial layout: [About Us] label left, big text right — NO title, NO tags */}
        <div className="grid md:grid-cols-[200px_1fr] gap-12 py-16 items-start">
          <div className="pt-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary border border-primary/30 rounded-full px-3 py-1 inline-block">
              [About Us]
            </p>
          </div>
          <div>
            {/* Body text 50% larger than base */}
            <p
              className="text-muted-foreground leading-relaxed max-w-2xl"
              style={{ fontSize: "1.5rem", lineHeight: "1.6" }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("aboutDescription", e.currentTarget.textContent || "")}
            >
              {content.aboutDescription}
            </p>
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
