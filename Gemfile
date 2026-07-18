source "https://rubygems.org"

# Pin to the GitHub Pages gem — ensures local builds match GitHub Pages
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-seo-tag"
end

# Ruby 3.4+/4.0 removed these from the default gems, but old Jekyll
# (via github-pages) still expects them to be implicitly available.
# Needed only for local dev builds — has no effect on the deployed site.
gem "csv"
gem "base64"
gem "logger"
gem "bigdecimal"
gem "webrick"
