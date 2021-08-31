package main

import (
	"context"
	"time"

	_ "expvar"
	_ "net/http/pprof"

	"mintter/backend"
	"mintter/backend/config"

	"github.com/alecthomas/kong"
	"github.com/burdiyan/go/kongcli"
	"github.com/burdiyan/go/mainutil"
	"go.uber.org/fx"
)

func main() {
	var cfg config.Config

	kong.Parse(&cfg,
		kong.Name("mintterd"),
		kong.Resolvers(kongcli.EnvResolver("")),
		kong.Description("Version: "+backend.Version),
	)

	mainutil.Run(func() error {
		app := fx.New(
			backend.Module(cfg),
			fx.StopTimeout(1*time.Minute),
		)

		ctx := mainutil.TrapSignals()

		if err := app.Start(ctx); err != nil {
			return err
		}

		<-ctx.Done()

		return app.Stop(context.Background())
	})
}
