param(
    [string]$Root = ".\frontend"
)

$directories = @(
    "$Root\src",
    "$Root\src\app",
    "$Root\src\app\guards",
    "$Root\src\app\layouts",
    "$Root\src\app\providers",
    "$Root\src\styles",
    "$Root\src\assets",
    "$Root\src\constants",
    "$Root\src\lib",
    "$Root\src\types",
    "$Root\src\api",
    "$Root\src\shared",
    "$Root\src\shared\components",
    "$Root\src\shared\components\common",
    "$Root\src\shared\components\navigation",
    "$Root\src\shared\components\post",
    "$Root\src\features",
    "$Root\src\features\landing",
    "$Root\src\features\landing\components",
    "$Root\src\features\landing\pages",
    "$Root\src\features\auth",
    "$Root\src\features\auth\components",
    "$Root\src\features\auth\hooks",
    "$Root\src\features\auth\pages",
    "$Root\src\features\feed",
    "$Root\src\features\feed\components",
    "$Root\src\features\feed\hooks",
    "$Root\src\features\feed\pages",
    "$Root\src\features\sections",
    "$Root\src\features\sections\components",
    "$Root\src\features\sections\hooks",
    "$Root\src\features\sections\pages",
    "$Root\src\features\search",
    "$Root\src\features\search\components",
    "$Root\src\features\search\hooks",
    "$Root\src\features\search\pages",
    "$Root\src\features\posts",
    "$Root\src\features\posts\components",
    "$Root\src\features\posts\hooks",
    "$Root\src\features\posts\pages",
    "$Root\src\features\comments",
    "$Root\src\features\comments\components",
    "$Root\src\features\comments\hooks",
    "$Root\src\features\profile",
    "$Root\src\features\profile\components",
    "$Root\src\features\profile\hooks",
    "$Root\src\features\profile\pages",
    "$Root\src\pages"
)

$files = @(
    "$Root\.env.example",
    "$Root\.gitignore",
    "$Root\index.html",
    "$Root\package.json",
    "$Root\tsconfig.json",
    "$Root\tsconfig.node.json",
    "$Root\vite.config.ts",
    "$Root\eslint.config.js",
    "$Root\README.md",

    "$Root\src\main.tsx",
    "$Root\src\App.tsx",
    "$Root\src\vite-env.d.ts",

    "$Root\src\app\router.tsx",
    "$Root\src\app\queryClient.ts",
    "$Root\src\app\guards\ProtectedRoute.tsx",
    "$Root\src\app\layouts\PublicLayout.tsx",
    "$Root\src\app\layouts\AppLayout.tsx",
    "$Root\src\app\providers\AuthProvider.tsx",
    "$Root\src\app\providers\QueryProvider.tsx",

    "$Root\src\styles\globals.css",
    "$Root\src\styles\theme.css",

    "$Root\src\assets\logo.svg",
    "$Root\src\assets\empty-feed.svg",
    "$Root\src\assets\empty-search.svg",

    "$Root\src\constants\routes.ts",
    "$Root\src\constants\queryKeys.ts",
    "$Root\src\constants\taxonomy.ts",

    "$Root\src\lib\http.ts",
    "$Root\src\lib\authStorage.ts",
    "$Root\src\lib\authFormData.ts",
    "$Root\src\lib\postFormData.ts",
    "$Root\src\lib\formatters.ts",
    "$Root\src\lib\validators.ts",
    "$Root\src\lib\utils.ts",

    "$Root\src\types\api.ts",
    "$Root\src\types\auth.ts",
    "$Root\src\types\user.ts",
    "$Root\src\types\post.ts",
    "$Root\src\types\comment.ts",
    "$Root\src\types\search.ts",

    "$Root\src\api\users.ts",
    "$Root\src\api\posts.ts",
    "$Root\src\api\comments.ts",

    "$Root\src\shared\components\common\Button.tsx",
    "$Root\src\shared\components\common\Input.tsx",
    "$Root\src\shared\components\common\Textarea.tsx",
    "$Root\src\shared\components\common\Select.tsx",
    "$Root\src\shared\components\common\FileUploadField.tsx",
    "$Root\src\shared\components\common\LoadingState.tsx",
    "$Root\src\shared\components\common\ErrorState.tsx",
    "$Root\src\shared\components\common\EmptyState.tsx",
    "$Root\src\shared\components\common\StatusBanner.tsx",
    "$Root\src\shared\components\common\PageHeader.tsx",

    "$Root\src\shared\components\navigation\Header.tsx",
    "$Root\src\shared\components\navigation\Footer.tsx",
    "$Root\src\shared\components\navigation\MobileNav.tsx",

    "$Root\src\shared\components\post\PostCard.tsx",
    "$Root\src\shared\components\post\PostList.tsx",
    "$Root\src\shared\components\post\CategoryBadge.tsx",
    "$Root\src\shared\components\post\ContentTypeBadge.tsx",
    "$Root\src\shared\components\post\ReactionBar.tsx",
    "$Root\src\shared\components\post\PostImage.tsx",

    "$Root\src\features\landing\components\HeroSection.tsx",
    "$Root\src\features\landing\components\FeatureGrid.tsx",
    "$Root\src\features\landing\components\CTASection.tsx",
    "$Root\src\features\landing\pages\LandingPage.tsx",

    "$Root\src\features\auth\components\LoginForm.tsx",
    "$Root\src\features\auth\components\RegisterForm.tsx",
    "$Root\src\features\auth\hooks\useAuth.ts",
    "$Root\src\features\auth\pages\LoginPage.tsx",
    "$Root\src\features\auth\pages\RegisterPage.tsx",

    "$Root\src\features\feed\components\FeedToolbar.tsx",
    "$Root\src\features\feed\components\TopPostsPanel.tsx",
    "$Root\src\features\feed\hooks\useAllPosts.ts",
    "$Root\src\features\feed\hooks\useTopPosts.ts",
    "$Root\src\features\feed\pages\HomeFeedPage.tsx",

    "$Root\src\features\sections\components\SectionHero.tsx",
    "$Root\src\features\sections\components\SectionFilters.tsx",
    "$Root\src\features\sections\hooks\useSectionPosts.ts",
    "$Root\src\features\sections\pages\SectionPage.tsx",

    "$Root\src\features\search\components\SemanticSearchBar.tsx",
    "$Root\src\features\search\components\SearchFilters.tsx",
    "$Root\src\features\search\components\SearchResultCard.tsx",
    "$Root\src\features\search\components\SearchResultsList.tsx",
    "$Root\src\features\search\components\GlobalSearchSections.tsx",
    "$Root\src\features\search\hooks\useSemanticSearch.ts",
    "$Root\src\features\search\hooks\useGlobalSearch.ts",
    "$Root\src\features\search\pages\SearchPage.tsx",

    "$Root\src\features\posts\components\PostForm.tsx",
    "$Root\src\features\posts\components\PostEditor.tsx",
    "$Root\src\features\posts\components\RelatedPostsPanel.tsx",
    "$Root\src\features\posts\components\MyPostsList.tsx",
    "$Root\src\features\posts\hooks\usePost.ts",
    "$Root\src\features\posts\hooks\usePostDetail.ts",
    "$Root\src\features\posts\hooks\useCreatePost.ts",
    "$Root\src\features\posts\hooks\useUpdatePost.ts",
    "$Root\src\features\posts\hooks\useDeletePost.ts",
    "$Root\src\features\posts\hooks\useReactToPost.ts",
    "$Root\src\features\posts\hooks\useMyPosts.ts",
    "$Root\src\features\posts\hooks\useRecommendations.ts",
    "$Root\src\features\posts\pages\CreatePostPage.tsx",
    "$Root\src\features\posts\pages\EditPostPage.tsx",
    "$Root\src\features\posts\pages\PostDetailPage.tsx",
    "$Root\src\features\posts\pages\MyPostsPage.tsx",

    "$Root\src\features\comments\components\CommentForm.tsx",
    "$Root\src\features\comments\components\CommentList.tsx",
    "$Root\src\features\comments\components\CommentItem.tsx",
    "$Root\src\features\comments\hooks\useComments.ts",
    "$Root\src\features\comments\hooks\useCreateComment.ts",
    "$Root\src\features\comments\hooks\useUpdateComment.ts",
    "$Root\src\features\comments\hooks\useDeleteComment.ts",

    "$Root\src\features\profile\components\ProfileHeader.tsx",
    "$Root\src\features\profile\components\ProfilePosts.tsx",
    "$Root\src\features\profile\hooks\useCurrentUser.ts",
    "$Root\src\features\profile\pages\ProfilePage.tsx",

    "$Root\src\pages\NotFoundPage.tsx"
)

Write-Host "Creating directories..."
foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "Creating files..."
foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Path $file -Force | Out-Null
    }
}

Write-Host ""
Write-Host "Frontend tree created at: $Root"