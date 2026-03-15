SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:

MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

PROJECT_NAME=hahow-assessment

# Check and install fnm
define check_fnm
	@if ! command -v fnm &> /dev/null; then \
		echo "📦 正在安裝 fnm (Fast Node Manager)..."; \
		if command -v brew &> /dev/null; then \
			brew install fnm; \
		elif command -v curl &> /dev/null; then \
			curl -fsSL https://fnm.vercel.app/install | bash; \
		else \
			echo "❌ 無法自動安裝 fnm，請參考 https://github.com/Schniz/fnm#installation"; \
			exit 1; \
		fi; \
		if [ $$? -eq 0 ]; then \
			echo "✅ fnm 安裝成功"; \
		else \
			echo "❌ fnm 安裝失敗"; \
			exit 1; \
		fi; \
	else \
		echo "✅ fnm 已安裝"; \
	fi
endef

# Check and install docker
define check_docker
	@if ! command -v docker &> /dev/null; then \
		if command -v brew &> /dev/null; then \
			echo "📦 正在安裝 Docker..."; \
			brew install --cask docker; \
			if [ $$? -eq 0 ]; then \
				echo "✅ Docker 安裝成功"; \
				echo "💡 請啟動 Docker Desktop 應用程式"; \
			else \
				echo "❌ Docker 安裝失敗"; \
				exit 1; \
			fi; \
		else \
			echo "❌ Docker 未安裝，請參考 https://docs.docker.com/get-docker/ 安裝"; \
			exit 1; \
		fi; \
	else \
		echo "✅ Docker 已安裝"; \
	fi
endef

# Check node version and install if not found
define check_node_version
	@if ! command -v fnm &> /dev/null; then \
		echo "❌ Error: fnm 未找到"; \
		echo "請使用 Homebrew 安裝 fnm:"; \
		echo "brew install fnm"; \
		echo ""; \
		echo "安裝完成後，請重新執行此指令。"; \
		exit 1; \
	fi
	@if [ ! -f ".nvmrc" ]; then \
		echo "⚠️  Warning: .nvmrc 檔案不存在"; \
		echo "請確認您在正確的專案目錄中執行此指令。"; \
		exit 1; \
	fi
	@required_version=$$(cat .nvmrc | tr -d '\n\r'); \
	echo "📋 專案需要 Node.js 版本：$$required_version"; \
	eval "$$(fnm env)"; \
	current_version=$$(fnm current 2>/dev/null || echo "Not set"); \
	if [ "$$current_version" != "$$required_version" ]; then \
		echo "🔄 當前版本：$$current_version ，需要切換到：$$required_version"; \
		echo "📦 正在安裝並切換到 Node.js $$required_version..."; \
		fnm install "$$required_version"; \
		if [ $$? -ne 0 ]; then \
			echo "❌ 安裝 Node.js $$required_version 失敗"; \
			exit 1; \
		fi; \
		eval "$$(fnm env)"; \
		fnm use "$$required_version"; \
		if [ $$? -ne 0 ]; then \
			echo "❌ 切換到 Node.js $$required_version 失敗"; \
			exit 1; \
		fi; \
		echo "✅ Successfully switched to Node.js $$required_version"; \
	else \
		echo "✅ Node.js 版本正確：$$current_version"; \
	fi
endef

# Check and install pnpm
define check_pnpm
	@if ! command -v pnpm &> /dev/null; then \
		echo "📦 正在安裝 pnpm..."; \
		corepack enable pnpm; \
		if [ $$? -eq 0 ]; then \
			echo "✅ pnpm 安裝成功"; \
		else \
			echo "❌ pnpm 安裝失敗"; \
			exit 1; \
		fi; \
	else \
		echo "✅ pnpm 已安裝"; \
	fi
endef

define init_package
	@echo "🔍 初始化前端套件..."
	pnpm install
	@echo "✅ 前端套件初始化完成"
endef

# Check and copy .env.development.example
define check_and_copy_env
	@if [ ! -f ".env.development" ]; then \
		echo "📋 .env.development 檔案不存在，複製 .env.development.example 中..."; \
		cp .env.development.example .env.development; \
	fi
	@if [ ! -f ".env.production" ]; then \
		echo "📋 .env.production 檔案不存在，複製 .env.production.example 中..."; \
		cp .env.production.example .env.production; \
	fi
endef

define check_msw_version
	@echo "🔍 初始化 MSW 版本..."
	npx msw init ./public --save
	@echo "✅ MSW 版本初始化完成"
endef

# Check and install required tools
define check_and_install_tools
	@echo "🔍 檢查必要工具安裝狀態..."
	@echo ""
	
	$(call check_fnm)
	$(call check_pnpm)
	$(call check_docker)
	
	@echo "🎉 所有必要工具安裝完成！"

	@echo "🔍 開發環境初始化..."
	@echo ""

	$(call init_package)
	$(call check_node_version)
	$(call check_and_copy_env)
	$(call check_msw_version)

	@echo "✅ 開發環境初始化完成"


	@echo ""
	@echo "🔍 請確認已安裝以下的 VSCode Extension"
	@echo "1. 安裝 biome 的 VSCode Extension"
	@echo "2. 安裝 Code Spell Checker Extension"

	@echo ""
	@echo "🔍 最後一步：執行 'make dev' 啟動開發伺服器"
endef

define type_check
	@echo "🔍 執行 TypeScript 型別檢查..."
	pnpm run type-check
	@echo "✅ TypeScript 型別檢查完成"
endef

## Check and setup node version
setup-node:  
	$(call check_node_version)
.PHONY: setup-node

init:  ## Initialize development environment (check and install required tools)
	$(call check_and_install_tools)
.PHONY: init

dev:  ## Start dev server
	@echo "Starting dev server..."
	$(call init_package)
	@pnpm run dev
.PHONY: dev

format:  ## Format code
	@echo "Formatting code..."
	@pnpm exec biome format --write ./src --max-diagnostics=none
.PHONY: format

lint:  ## Run lint
	@echo "Running lint..."
	@pnpm exec biome lint --max-diagnostics=none
.PHONY: lint

check:  ## Check code
	@echo "Checking code..."
	@pnpm exec biome check --max-diagnostics=none
.PHONY: check

ci:  ## Run ci
	@echo "Running ci..."
	@pnpm exec biome ci --max-diagnostics=none
.PHONY: ci

ts-check:  ## Run ts-check
	@echo "Running ts-check..."
	$(call type_check)
.PHONY: ts-check

## Build (usage: make build [branch=develop|main])
branch ?=

define switch_branch
	@if [ -n "$(branch)" ]; then \
		if [ "$(branch)" = "develop" ] || [ "$(branch)" = "main" ]; then \
			echo "Switching to $(branch) branch..."; \
			git checkout $(branch); \
			git pull origin $(branch); \
		else \
			echo "❌ Error: Unsupported branch '$(branch)', please use 'develop' or 'main'"; \
			exit 1; \
		fi; \
	else \
		echo "📋 No branch specified, staying on current branch..."; \
	fi
endef

build-local: setup-node  ## Build Docker image only
	$(call switch_branch)
	@echo "Building docker image..."
	docker buildx build \
	  --platform linux/amd64 \
	  -t chriskang028/hahow-assessment:latest \
	  .
.PHONY: build-local

build-push:  ## Push Docker image to registry
	@echo "Pushing docker image..."
	docker push chriskang028/hahow-assessment:latest
.PHONY: build-push

build: build-local build-push  ## Build and push Docker image
.PHONY: build

