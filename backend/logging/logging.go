// Package logging is a convenience wrapper around IPFS logging package, which itself is a convenience
// package around Zap logger. This package disourages usage of global loggers though, and allows to create
// named loggers specifying their logging level in one call.
package logging

import (
	"github.com/ipfs/go-log/v2"
	"go.uber.org/zap"
)

// Logger creates a new named logger with the specified level.
// If logger was created before it will just set the level.
func Logger(subsystem, level string) *zap.Logger {
	l := log.Logger(subsystem).Desugar()

	if err := log.SetLogLevel(subsystem, level); err != nil {
		panic(err)
	}

	return l
}

// SetLogLevel sets the level on the named logger. It may panic
// in case of a non-existing name.
func SetLogLevel(subsystem, level string) {
	if err := log.SetLogLevel(subsystem, level); err != nil {
		panic(err)
	}
}

// Config is an alias for IPFS logging config. Exported for convenience.
type Config = log.Config

// Output formats.
const (
	ColorizedOutput = log.ColorizedOutput
	PlaintextOutput = log.PlaintextOutput
	JSONOutput      = log.JSONOutput
)

// Setup global parent logger with the specified config.
func Setup(cfg Config) {
	log.SetupLogging(cfg)
}

// DefaultConfig creates a default logging config.
func DefaultConfig() Config {
	return Config{
		Format: log.ColorizedOutput,
		Stderr: true,
		Level:  log.LevelError,
		Labels: map[string]string{},
	}
}
