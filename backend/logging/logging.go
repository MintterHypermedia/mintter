// Package logging is the logging library used by Mintter
package logging

import (
	"mintter/monitoring"
	"os"
	"time"

	ipfslog "github.com/ipfs/go-log"
	"go.uber.org/zap"
)

var DisabledTelemetry = false

// StandardLogger provides API compatibility with standard printf loggers
// eg. go-logging
type StandardLogger interface {
	Debug(msg string, fields ...zap.Field)
	Debugf(format string, args ...interface{})
	Error(msg string, fields ...zap.Field)
	Errorf(format string, args ...interface{})
	Fatal(msg string, fields ...zap.Field)
	Fatalf(format string, args ...interface{})
	Info(msg string, fields ...zap.Field)
	Infof(format string, args ...interface{})
	Panic(msg string, fields ...zap.Field)
	Panicf(format string, args ...interface{})
	Warn(msg string, fields ...zap.Field)
	Warnf(format string, args ...interface{})
}

// EventLogger extends the StandardLogger interface to allow for log items
// containing structured metadata
type EventLogger interface {
	StandardLogger
}

// Logger retrieves an event logger by name
// TODO: Should we return error?
func Logger(system string) *ZapEventLogger {
	if len(system) == 0 {
		setuplog := getLogger("setup-logger")
		setuplog.Error("Missing name parameter")
		system = "undefined"
	}

	var lokiLogger *zap.Logger

	if !DisabledTelemetry {
		var err error
		lokiLogger, err = monitoring.NewLokiLogger()
		if err != nil {
			setuplog := getLogger("setup-logger")
			setuplog.Error("Loki logger failed to create")
			system = "undefined"
		}
	}

	logger := getLogger(system)
	// unused?
	//skipLogger := logger.Desugar().WithOptions(zap.AddCallerSkip(1)).Sugar()

	return &ZapEventLogger{
		system:     system,
		Logger:     *logger,
		LokiLogger: lokiLogger,
		//skipLogger:    *skipLogger,
	}
}

// ZapEventLogger implements the EventLogger and wraps a go-logging Logger
type ZapEventLogger struct {
	zap.Logger
	LokiLogger *zap.Logger
	// used to fix the caller location when calling Warning and Warningf.
	// skipLogger zap.SugaredLogger
	system string
}

////////////////////////////////////////////////////////////////////////////////////
// Add more functions if wanted, pick them from
// https://github.com/uber-go/zap/blob/89e382035d3a984a01e6c9c8be5462f11efac844/sugar.go#L106

// Meter en LokiLogger directamente
func appendHostname(fields []zap.Field) []zap.Field {
	hostname, _ := os.Hostname()
	fields = append(fields, zap.String("hostname", hostname))
	return fields
}

func (logger *ZapEventLogger) Debug(msg string, fields ...zap.Field) {
	logger.Logger.Debug(msg, fields...)
	if logger.LokiLogger != nil {
		fields = appendHostname(fields)
		logger.LokiLogger.Debug(msg, fields...)
	}
}

func (logger *ZapEventLogger) Info(msg string, fields ...zap.Field) {
	logger.Logger.Info(msg, fields...)
	if logger.LokiLogger != nil {
		fields = appendHostname(fields)
		logger.LokiLogger.Info(msg, fields...)
	}
}

func (logger *ZapEventLogger) Warn(msg string, fields ...zap.Field) {
	logger.Logger.Warn(msg, fields...)
	if logger.LokiLogger != nil {
		fields = appendHostname(fields)
		logger.LokiLogger.Warn(msg, fields...)
	}
}

func (logger *ZapEventLogger) Error(msg string, fields ...zap.Field) {
	logger.Logger.Error(msg, fields...)
	if logger.LokiLogger != nil {
		fields = appendHostname(fields)
		logger.LokiLogger.Warn(msg, fields...)
	}
}

// TODO: This enables ipfs logs, but we still have to forward them to loki
func init() {
	/*
		IPFS Subsystems:

		autonat blankhost p2p-config ping stream-upgrader swarm2 dht.pb quic-transport connmgr
		test-logger nat discovery routedhost diversityFilter peerstore/ds engine reprovider.simple
		reuseport-transport tcp-tpt dht/RtRefreshManager blockstore provider.simple bs:sprmgr chunk
		ipns blockservice bitswap mplex basichost relay autorelay providers dht bs:peermgr bs:sess
		addrutil routing/record table badger provider.queue peerstore bitswap_network net/identify
		secio pubsub eventlog common]
	*/
	//var Logger = ipfslog.Logger("common")

	ipfslog.SetAllLoggers(ipfslog.LevelInfo)
	//_ = ipfslog.SetLogLevel("common", "info")
}

// FormatRFC3339 returns the given time in UTC with RFC3999Nano format.
func FormatRFC3339(t time.Time) string {
	return t.UTC().Format(time.RFC3339Nano)
}
