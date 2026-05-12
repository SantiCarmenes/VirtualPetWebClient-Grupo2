$files = Get-ChildItem -Path "docs\new" -Filter "*.md"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove image tags ![](media/...)
    $content = $content -replace '!\[.*?\]\(media/.*?\)(\{width=".*?"\s*height=".*?"\})?', ''
    
    # Remove pandoc mark span syntax [text]{.mark} -> text
    $content = $content -replace '\[(.*?)\]\{\.mark\}', '$1'
    
    # Remove escaped parens around numbers like 1\) -> 1)
    $content = $content -replace '(\d+)\\(\))', '$1$2'
    
    # Fix single newlines to unwrap lines:
    # If a newline is NOT followed by a blank line, a list item, or a header, replace it with a space.
    # $content = $content -replace '(?<!\n)\n(?!\n|\s*[-*+]|\s*\d+\.|\s*#)', ' '
    # Actually, regex line unwrapping can be tricky. Let's just do the basic cleanup first.

    # Remove multiple blank lines
    $content = $content -replace '\n{3,}', "`n`n"
    
    # Trim leading/trailing whitespace
    $content = $content.Trim()

    Set-Content -Path $file.FullName -Value $content
    Write-Host "Processed $($file.Name)"
}
