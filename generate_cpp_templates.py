import os

templates = {
     
}

template_dir = "templates/cpp"

for filename, content in templates.items():
    file_path = os.path.join(
        template_dir,
        f"{filename}.txt"
    )

    with open(
        file_path,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(content)

    print(f"Created: {file_path}")

print("Done!")