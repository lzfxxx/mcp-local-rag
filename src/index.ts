#!/usr/bin/env node
// Entry point for mcp-local-rag-anything
// Routes to CLI subcommands or starts the MCP server

// ============================================
// Routing
// ============================================

const SUBCOMMANDS = new Set(['skills'])

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const firstArg = args[0]

  if (firstArg && SUBCOMMANDS.has(firstArg)) {
    // CLI subcommand (lazy import to avoid loading server/embedder deps)
    const { handleCli } = await import('./cli-main.js')
    handleCli(args)
    return
  }

  // Default: start MCP server
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    process.exit(1)
  })

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
    process.exit(1)
  })

  const { startServer } = await import('./server-main.js')
  startServer()
}

void main()
