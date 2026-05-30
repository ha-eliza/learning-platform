<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: "Dejavu Sans", sans-serif;
            font-size: 13px;
            color: #334155;
            line-height: 1.6;
        }
        .header {
            border-b: 1px solid #e2e8f0;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .category {
            font-size: 10px;
            text-transform: uppercase;
            color: #900007;
            font-weight: bold;
        }
        .title {
            font-size: 24px;
            color: #1e293b;
            margin: 10px 0;
        }
        .meta {
            font-size: 11px;
            color: #94a3b8;
        }
        .content {
            margin-top: 20px;
        }
        /* Стили для кода из Markdown */
        pre {
            background-color: #f1f5f9;
            padding: 10px;
            border-radius: 6px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="header">
        <span class="category">{{ $category }}</span>
        <h1 class="title">{{ $title }}</h1>
        <div class="meta">
            <span>{{ $teacher }}</span> | <span>{{ $date }}</span>
        </div>
    </div>

    <div class="content">
        {!! $content !!}
    </div>
</body>
</html>
