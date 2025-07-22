import os

patterns = [
    ("{ingressosInfo.description}", "{ingressosInfo?.description ?? '—'}"),
    ("{getIngressosText().description", "{getIngressosText()?.description"),
    ("{link.description}", "{link?.description ?? '—'}"),
    ("{challenge.description}", "{challenge?.description ?? '—'}"),
    ("{customLink.description}", "{customLink?.description ?? '—'}"),
    ("{formData.description}", "{formData?.description ?? '—'}"),
    ("{editData.description", "{editData?.description"),
    ("{item.description}", "{item?.description ?? '—'}"),
    ("{message.text}", "{message?.text ?? '—'}"),
    ("{option.label}", "{option?.label ?? '—'}"),
    ("{USER_TYPE.label}", "{USER_TYPE?.label ?? '—'}"),
    ("{v.label}", "{v?.label ?? '—'}"),
    ("{tipo.descricao}", "{tipo?.descricao ?? '—'}"),
    ("{selectedCategory?.label}", "{selectedCategory?.label ?? '—'}"),
    ("{cat.label}", "{cat?.label ?? '—'}"),
    ("{cat.icon}", "{cat?.icon ?? '—'}"),
    ("{USER_TYPES[u.role]?.label}", "{USER_TYPES[u.role]?.label ?? '—'}"),
    ("{USER_TYPES[u.role]?.icon}", "{USER_TYPES[u.role]?.icon ?? '—'}"),
    ("{issue.message}", "{issue?.message ?? '—'}"),
]

def apply_patch(base_path="src"):
    for root, _, files in os.walk(base_path):
        for file in files:
            if file.endswith(".tsx"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                updated_content = content
                changed = False

                for original, replacement in patterns:
                    if original in updated_content:
                        updated_content = updated_content.replace(original, replacement)
                        changed = True

                if changed:
                    print(f"[MODIFIED] {path}")
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(updated_content)

if __name__ == "__main__":
    apply_patch()
