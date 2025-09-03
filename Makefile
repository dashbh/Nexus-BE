.PHONY: all clean-artifacts extract-artifacts package-artifacts build

# Configurable
ARTIFACTS_DIR ?= artifacts
APPS_DIR := apps
PKGS_DIR := packages

# Common
TIMESTAMP := $(shell date +%Y%m%d-%H%M%S)
MANIFEST := $(ARTIFACTS_DIR)/manifest.txt

all: clean-artifacts build extract-artifacts package-artifacts

## Clean artifacts
clean-artifacts:
	@echo "🧹 Cleaning artifacts..."
	rm -rf $(ARTIFACTS_DIR)

## Optional build step (customize for your monorepo build tool)
build:
	@echo "🔨 Running build step"
	@if [ -f package.json ]; then \
		echo "Running pnpm build..."; \
		pnpm run build || true; \
	fi

## Extract dist + lockfiles into artifacts dir
extract-artifacts:
	@echo "📦 Extracting artifacts into $(ARTIFACTS_DIR)"
	mkdir -p $(ARTIFACTS_DIR)/apps $(ARTIFACTS_DIR)/packages

	@for app in $(APPS_DIR)/*; do \
		if [ -d "$$app/dist" ]; then \
			name=$$(basename $$app); \
			target=$(ARTIFACTS_DIR)/apps/$$name; \
			mkdir -p $$target; \
			cp -r $$app/dist $$target/; \
			cp -f $$app/package.json $$target/ 2>/dev/null || true; \
			cp -f $$app/package-lock.json $$target/ 2>/dev/null || true; \
			cp -f $$app/pnpm-lock.yaml $$target/ 2>/dev/null || true; \
			echo "   ✔ extracted $$app → $$target"; \
		fi \
	done

	@for pkg in $(PKGS_DIR)/*; do \
		if [ -d "$$pkg/dist" ]; then \
			name=$$(basename $$pkg); \
			target=$(ARTIFACTS_DIR)/packages/$$name; \
			mkdir -p $$target; \
			cp -r $$pkg/dist $$target/; \
			cp -f $$pkg/package.json $$target/ 2>/dev/null || true; \
			cp -f $$pkg/package-lock.json $$target/ 2>/dev/null || true; \
			cp -f $$pkg/pnpm-lock.yaml $$target/ 2>/dev/null || true; \
			echo "   ✔ extracted $$pkg → $$target"; \
		fi \
	done

	@if [ -f ecosystem.config.js ]; then \
		cp ecosystem.config.js $(ARTIFACTS_DIR)/; \
		echo "   ✔ copied ecosystem.config.js → $(ARTIFACTS_DIR)"; \
	fi

	@echo "✅ Extraction complete"

## Package artifacts into tarball for CI/CD (ready to push/upload)
package-artifacts:
	@echo "📦 Packaging artifacts..."
	@mkdir -p $(ARTIFACTS_DIR)
	@find $(ARTIFACTS_DIR) -type f -exec sha256sum {} \; > $(MANIFEST)
	tar -czf $(ARTIFACTS_DIR)-$(TIMESTAMP).tar.gz $(ARTIFACTS_DIR)
	@echo "✅ Packaged: $(ARTIFACTS_DIR)-$(TIMESTAMP).tar.gz"
	@echo "   (manifest at $(MANIFEST))"
