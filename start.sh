#!/bin/sh

echo "🚀 Starting Event Website..."
echo "📊 Environment: $NODE_ENV"
echo "🌐 Port: $PORT"
echo "🏠 Hostname: $HOSTNAME"
echo "👤 User: $(whoami)"
echo "📁 Working Directory: $(pwd)"

# List current directory contents
echo "📂 Directory contents:"
ls -la

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found!"
    echo "🔍 Looking for Next.js files..."
    find . -name "*.js" -type f | head -10
    exit 1
fi

echo "✅ server.js found, starting application..."
echo "🔧 Node.js version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

# Start the Next.js server with error handling
echo "🎯 Starting Next.js server..."
exec node server.js
