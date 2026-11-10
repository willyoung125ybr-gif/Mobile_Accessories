$dir = $PSScriptRoot

function Transform-File([string]$sourceRel, [string]$destRel) {
    $srcPath = Join-Path $dir $sourceRel
    $destPath = Join-Path $dir $destRel

    $content = [System.IO.File]::ReadAllText($srcPath, [System.Text.Encoding]::UTF8)

    # Replace script references
    $content = $content -replace '<script src="\.\./nav-connector\.js"></script>', '<script src="store.js"></script>'
    $content = $content -replace '<script src="nav-connector\.js"></script>', '<script src="store.js"></script>'
    if ($content -notmatch 'src="store\.js"') {
        $content = $content -replace '</body>', '<script src="store.js"></script></body>'
    }

    # Navigation bar paths
    $content = $content -replace 'data-path="home" href="#"', 'data-path="home" href="index.html"'
    $content = $content -replace 'data-path="shop-all" href="#"', 'data-path="shop-all" href="shop.html"'
    $content = $content -replace 'data-path="iphone-cases" href="#"', 'data-path="iphone-cases" href="shop.html"'
    $content = $content -replace 'data-path="samsung-cases" href="#"', 'data-path="samsung-cases" href="shop.html"'
    $content = $content -replace 'data-path="magsafe-and-tech" href="#"', 'data-path="magsafe-and-tech" href="shop.html"'
    $content = $content -replace 'data-path="glass-screen-protectors" href="#"', 'data-path="glass-screen-protectors" href="shop.html"'
    $content = $content -replace 'data-path="cart" href="#"', 'data-path="cart" href="cart.html"'

    # CTA Buttons
    $content = $content -replace 'href="#bestsellers"><span>SHOP COLLECTION</span>', 'href="shop.html"><span>SHOP COLLECTION</span>'

    # PDP Buttons & Interactivity
    $content = $content -replace 'onclick="handleAddToCart\(\)"', 'onclick="addToCart({id:''armorshield-pro'', title:''AURA ArmorShield Pro MagSafe'', price:48.00, color:''Titanium Graphite'', model:''iPhone 16 Pro''})"'
    $content = $content -replace 'onclick="triggerApplePay\(\)"', 'onclick="triggerCheckoutModal(''applepay'')"'
    $content = $content -replace 'data-path="checkout" href="#"', 'onclick="triggerCheckoutModal()"'

    # Cart page checkout buttons
    $content = $content -replace 'href="#checkout"', 'onclick="triggerCheckoutModal()"'

    # Breadcrumb fixes
    $content = $content -replace '<a class="hover:text-primary transition-colors" href="#">Home</a>', '<a class="hover:text-primary transition-colors" href="index.html">Home</a>'
    $content = $content -replace '<a class="hover:text-primary transition-colors" href="#">Shop</a>', '<a class="hover:text-primary transition-colors" href="shop.html">Shop</a>'
    $content = $content -replace '<a class="hover:text-primary transition-colors" href="#">iPhone Cases</a>', '<a class="hover:text-primary transition-colors" href="shop.html">iPhone Cases</a>'

    [System.IO.File]::WriteAllText($destPath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Created: $destRel" -ForegroundColor Green
}

# 1. Transform Homepage -> index.html
Transform-File "homepage_aura_studio/code.html" "index.html"

# 2. Transform Shop Catalog -> shop.html
Transform-File "shop_all_phone_cases_collection/code.html" "shop.html"

# 3. Transform Product Detail -> product.html
Transform-File "aura_armorshield_pro_product_detail_page/code.html" "product.html"

# 4. Transform Shopping Bag -> cart.html
Transform-File "shopping_bag_checkout_aura_studio/code.html" "cart.html"

Write-Host "Site build complete!" -ForegroundColor Cyan
