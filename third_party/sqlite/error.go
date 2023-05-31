// Copyright (c) 2018 David Crawshaw <david@zentus.com>
//
// Permission to use, copy, modify, and distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

package sqlite

// #include <sqlite3.h>
import "C"
import "errors"

// Error is an error produced by SQLite.
type Error struct {
	Code  ErrorCode // SQLite extended error code (SQLITE_OK is an invalid value)
	Loc   string    // method name that generated the error
	Query string    // original SQL query text
	Msg   string    // value of sqlite3_errmsg, set sqlite.ErrMsg = true
}

func (err Error) Error() string {
	str := "sqlite"
	if err.Loc != "" {
		str += "." + err.Loc
	}
	str += ": " + err.Code.String()
	if err.Msg != "" {
		str += ": " + err.Msg
	}
	if err.Query != "" {
		str += " (" + err.Query + ")"
	}
	return str
}

// ErrorCode is an SQLite extended error code.
//
// The three SQLite result codes (SQLITE_OK, SQLITE_ROW, and SQLITE_DONE),
// are not errors so they should not be used in an Error.
type ErrorCode int

func (code ErrorCode) String() string {
	switch code {
	default:
		var buf [20]byte
		return "SQLITE_UNKNOWN_ERR(" + string(itoa(buf[:], int64(code))) + ")"
	case SQLITE_OK:
		return "SQLITE_OK(not an error)"
	case SQLITE_ROW:
		return "SQLITE_ROW(not an error)"
	case SQLITE_DONE:
		return "SQLITE_DONE(not an error)"
	case SQLITE_ERROR:
		return "SQLITE_ERROR"
	case SQLITE_INTERNAL:
		return "SQLITE_INTERNAL"
	case SQLITE_PERM:
		return "SQLITE_PERM"
	case SQLITE_ABORT:
		return "SQLITE_ABORT"
	case SQLITE_BUSY:
		return "SQLITE_BUSY"
	case SQLITE_LOCKED:
		return "SQLITE_LOCKED"
	case SQLITE_NOMEM:
		return "SQLITE_NOMEM"
	case SQLITE_READONLY:
		return "SQLITE_READONLY"
	case SQLITE_INTERRUPT:
		return "SQLITE_INTERRUPT"
	case SQLITE_IOERR:
		return "SQLITE_IOERR"
	case SQLITE_CORRUPT:
		return "SQLITE_CORRUPT"
	case SQLITE_NOTFOUND:
		return "SQLITE_NOTFOUND"
	case SQLITE_FULL:
		return "SQLITE_FULL"
	case SQLITE_CANTOPEN:
		return "SQLITE_CANTOPEN"
	case SQLITE_PROTOCOL:
		return "SQLITE_PROTOCOL"
	case SQLITE_EMPTY:
		return "SQLITE_EMPTY"
	case SQLITE_SCHEMA:
		return "SQLITE_SCHEMA"
	case SQLITE_TOOBIG:
		return "SQLITE_TOOBIG"
	case SQLITE_CONSTRAINT:
		return "SQLITE_CONSTRAINT"
	case SQLITE_MISMATCH:
		return "SQLITE_MISMATCH"
	case SQLITE_MISUSE:
		return "SQLITE_MISUSE"
	case SQLITE_NOLFS:
		return "SQLITE_NOLFS"
	case SQLITE_AUTH:
		return "SQLITE_AUTH"
	case SQLITE_FORMAT:
		return "SQLITE_FORMAT"
	case SQLITE_RANGE:
		return "SQLITE_RANGE"
	case SQLITE_NOTADB:
		return "SQLITE_NOTADB"
	case SQLITE_NOTICE:
		return "SQLITE_NOTICE"
	case SQLITE_WARNING:
		return "SQLITE_WARNING"

	case SQLITE_ERROR_MISSING_COLLSEQ:
		return "SQLITE_ERROR_MISSING_COLLSEQ"
	case SQLITE_ERROR_RETRY:
		return "SQLITE_ERROR_RETRY"
	case SQLITE_ERROR_SNAPSHOT:
		return "SQLITE_ERROR_SNAPSHOT"
	case SQLITE_IOERR_READ:
		return "SQLITE_IOERR_READ"
	case SQLITE_IOERR_SHORT_READ:
		return "SQLITE_IOERR_SHORT_READ"
	case SQLITE_IOERR_WRITE:
		return "SQLITE_IOERR_WRITE"
	case SQLITE_IOERR_FSYNC:
		return "SQLITE_IOERR_FSYNC"
	case SQLITE_IOERR_DIR_FSYNC:
		return "SQLITE_IOERR_DIR_FSYNC"
	case SQLITE_IOERR_TRUNCATE:
		return "SQLITE_IOERR_TRUNCATE"
	case SQLITE_IOERR_FSTAT:
		return "SQLITE_IOERR_FSTAT"
	case SQLITE_IOERR_UNLOCK:
		return "SQLITE_IOERR_UNLOCK"
	case SQLITE_IOERR_RDLOCK:
		return "SQLITE_IOERR_RDLOCK"
	case SQLITE_IOERR_DELETE:
		return "SQLITE_IOERR_DELETE"
	case SQLITE_IOERR_BLOCKED:
		return "SQLITE_IOERR_BLOCKED"
	case SQLITE_IOERR_NOMEM:
		return "SQLITE_IOERR_NOMEM"
	case SQLITE_IOERR_ACCESS:
		return "SQLITE_IOERR_ACCESS"
	case SQLITE_IOERR_CHECKRESERVEDLOCK:
		return "SQLITE_IOERR_CHECKRESERVEDLOCK"
	case SQLITE_IOERR_LOCK:
		return "SQLITE_IOERR_LOCK"
	case SQLITE_IOERR_CLOSE:
		return "SQLITE_IOERR_CLOSE"
	case SQLITE_IOERR_DIR_CLOSE:
		return "SQLITE_IOERR_DIR_CLOSE"
	case SQLITE_IOERR_SHMOPEN:
		return "SQLITE_IOERR_SHMOPEN"
	case SQLITE_IOERR_SHMSIZE:
		return "SQLITE_IOERR_SHMSIZE"
	case SQLITE_IOERR_SHMLOCK:
		return "SQLITE_IOERR_SHMLOCK"
	case SQLITE_IOERR_SHMMAP:
		return "SQLITE_IOERR_SHMMAP"
	case SQLITE_IOERR_SEEK:
		return "SQLITE_IOERR_SEEK"
	case SQLITE_IOERR_DELETE_NOENT:
		return "SQLITE_IOERR_DELETE_NOENT"
	case SQLITE_IOERR_MMAP:
		return "SQLITE_IOERR_MMAP"
	case SQLITE_IOERR_GETTEMPPATH:
		return "SQLITE_IOERR_GETTEMPPATH"
	case SQLITE_IOERR_CONVPATH:
		return "SQLITE_IOERR_CONVPATH"
	case SQLITE_IOERR_VNODE:
		return "SQLITE_IOERR_VNODE"
	case SQLITE_IOERR_AUTH:
		return "SQLITE_IOERR_AUTH"
	case SQLITE_IOERR_BEGIN_ATOMIC:
		return "SQLITE_IOERR_BEGIN_ATOMIC"
	case SQLITE_IOERR_COMMIT_ATOMIC:
		return "SQLITE_IOERR_COMMIT_ATOMIC"
	case SQLITE_IOERR_ROLLBACK_ATOMIC:
		return "SQLITE_IOERR_ROLLBACK_ATOMIC"
	case SQLITE_LOCKED_SHAREDCACHE:
		return "SQLITE_LOCKED_SHAREDCACHE"
	case SQLITE_BUSY_RECOVERY:
		return "SQLITE_BUSY_RECOVERY"
	case SQLITE_BUSY_SNAPSHOT:
		return "SQLITE_BUSY_SNAPSHOT"
	case SQLITE_CANTOPEN_NOTEMPDIR:
		return "SQLITE_CANTOPEN_NOTEMPDIR"
	case SQLITE_CANTOPEN_ISDIR:
		return "SQLITE_CANTOPEN_ISDIR"
	case SQLITE_CANTOPEN_FULLPATH:
		return "SQLITE_CANTOPEN_FULLPATH"
	case SQLITE_CANTOPEN_CONVPATH:
		return "SQLITE_CANTOPEN_CONVPATH"
	case SQLITE_CORRUPT_VTAB:
		return "SQLITE_CORRUPT_VTAB"
	case SQLITE_READONLY_RECOVERY:
		return "SQLITE_READONLY_RECOVERY"
	case SQLITE_READONLY_CANTLOCK:
		return "SQLITE_READONLY_CANTLOCK"
	case SQLITE_READONLY_ROLLBACK:
		return "SQLITE_READONLY_ROLLBACK"
	case SQLITE_READONLY_DBMOVED:
		return "SQLITE_READONLY_DBMOVED"
	case SQLITE_READONLY_CANTINIT:
		return "SQLITE_READONLY_CANTINIT"
	case SQLITE_READONLY_DIRECTORY:
		return "SQLITE_READONLY_DIRECTORY"
	case SQLITE_ABORT_ROLLBACK:
		return "SQLITE_ABORT_ROLLBACK"
	case SQLITE_CONSTRAINT_CHECK:
		return "SQLITE_CONSTRAINT_CHECK"
	case SQLITE_CONSTRAINT_COMMITHOOK:
		return "SQLITE_CONSTRAINT_COMMITHOOK"
	case SQLITE_CONSTRAINT_FOREIGNKEY:
		return "SQLITE_CONSTRAINT_FOREIGNKEY"
	case SQLITE_CONSTRAINT_FUNCTION:
		return "SQLITE_CONSTRAINT_FUNCTION"
	case SQLITE_CONSTRAINT_NOTNULL:
		return "SQLITE_CONSTRAINT_NOTNULL"
	case SQLITE_CONSTRAINT_PRIMARYKEY:
		return "SQLITE_CONSTRAINT_PRIMARYKEY"
	case SQLITE_CONSTRAINT_TRIGGER:
		return "SQLITE_CONSTRAINT_TRIGGER"
	case SQLITE_CONSTRAINT_UNIQUE:
		return "SQLITE_CONSTRAINT_UNIQUE"
	case SQLITE_CONSTRAINT_VTAB:
		return "SQLITE_CONSTRAINT_VTAB"
	case SQLITE_CONSTRAINT_ROWID:
		return "SQLITE_CONSTRAINT_ROWID"
	case SQLITE_NOTICE_RECOVER_WAL:
		return "SQLITE_NOTICE_RECOVER_WAL"
	case SQLITE_NOTICE_RECOVER_ROLLBACK:
		return "SQLITE_NOTICE_RECOVER_ROLLBACK"
	case SQLITE_WARNING_AUTOINDEX:
		return "SQLITE_WARNING_AUTOINDEX"
	case SQLITE_AUTH_USER:
		return "SQLITE_AUTH_USER"
	}
}

const (
	SQLITE_OK         = ErrorCode(C.SQLITE_OK) // do not use in Error
	SQLITE_ERROR      = ErrorCode(C.SQLITE_ERROR)
	SQLITE_INTERNAL   = ErrorCode(C.SQLITE_INTERNAL)
	SQLITE_PERM       = ErrorCode(C.SQLITE_PERM)
	SQLITE_ABORT      = ErrorCode(C.SQLITE_ABORT)
	SQLITE_BUSY       = ErrorCode(C.SQLITE_BUSY)
	SQLITE_LOCKED     = ErrorCode(C.SQLITE_LOCKED)
	SQLITE_NOMEM      = ErrorCode(C.SQLITE_NOMEM)
	SQLITE_READONLY   = ErrorCode(C.SQLITE_READONLY)
	SQLITE_INTERRUPT  = ErrorCode(C.SQLITE_INTERRUPT)
	SQLITE_IOERR      = ErrorCode(C.SQLITE_IOERR)
	SQLITE_CORRUPT    = ErrorCode(C.SQLITE_CORRUPT)
	SQLITE_NOTFOUND   = ErrorCode(C.SQLITE_NOTFOUND)
	SQLITE_FULL       = ErrorCode(C.SQLITE_FULL)
	SQLITE_CANTOPEN   = ErrorCode(C.SQLITE_CANTOPEN)
	SQLITE_PROTOCOL   = ErrorCode(C.SQLITE_PROTOCOL)
	SQLITE_EMPTY      = ErrorCode(C.SQLITE_EMPTY)
	SQLITE_SCHEMA     = ErrorCode(C.SQLITE_SCHEMA)
	SQLITE_TOOBIG     = ErrorCode(C.SQLITE_TOOBIG)
	SQLITE_CONSTRAINT = ErrorCode(C.SQLITE_CONSTRAINT)
	SQLITE_MISMATCH   = ErrorCode(C.SQLITE_MISMATCH)
	SQLITE_MISUSE     = ErrorCode(C.SQLITE_MISUSE)
	SQLITE_NOLFS      = ErrorCode(C.SQLITE_NOLFS)
	SQLITE_AUTH       = ErrorCode(C.SQLITE_AUTH)
	SQLITE_FORMAT     = ErrorCode(C.SQLITE_FORMAT)
	SQLITE_RANGE      = ErrorCode(C.SQLITE_RANGE)
	SQLITE_NOTADB     = ErrorCode(C.SQLITE_NOTADB)
	SQLITE_NOTICE     = ErrorCode(C.SQLITE_NOTICE)
	SQLITE_WARNING    = ErrorCode(C.SQLITE_WARNING)
	SQLITE_ROW        = ErrorCode(C.SQLITE_ROW)  // do not use in Error
	SQLITE_DONE       = ErrorCode(C.SQLITE_DONE) // do not use in Error

	SQLITE_ERROR_MISSING_COLLSEQ   = ErrorCode(C.SQLITE_ERROR_MISSING_COLLSEQ)
	SQLITE_ERROR_RETRY             = ErrorCode(C.SQLITE_ERROR_RETRY)
	SQLITE_ERROR_SNAPSHOT          = ErrorCode(C.SQLITE_ERROR_SNAPSHOT)
	SQLITE_IOERR_READ              = ErrorCode(C.SQLITE_IOERR_READ)
	SQLITE_IOERR_SHORT_READ        = ErrorCode(C.SQLITE_IOERR_SHORT_READ)
	SQLITE_IOERR_WRITE             = ErrorCode(C.SQLITE_IOERR_WRITE)
	SQLITE_IOERR_FSYNC             = ErrorCode(C.SQLITE_IOERR_FSYNC)
	SQLITE_IOERR_DIR_FSYNC         = ErrorCode(C.SQLITE_IOERR_DIR_FSYNC)
	SQLITE_IOERR_TRUNCATE          = ErrorCode(C.SQLITE_IOERR_TRUNCATE)
	SQLITE_IOERR_FSTAT             = ErrorCode(C.SQLITE_IOERR_FSTAT)
	SQLITE_IOERR_UNLOCK            = ErrorCode(C.SQLITE_IOERR_UNLOCK)
	SQLITE_IOERR_RDLOCK            = ErrorCode(C.SQLITE_IOERR_RDLOCK)
	SQLITE_IOERR_DELETE            = ErrorCode(C.SQLITE_IOERR_DELETE)
	SQLITE_IOERR_BLOCKED           = ErrorCode(C.SQLITE_IOERR_BLOCKED)
	SQLITE_IOERR_NOMEM             = ErrorCode(C.SQLITE_IOERR_NOMEM)
	SQLITE_IOERR_ACCESS            = ErrorCode(C.SQLITE_IOERR_ACCESS)
	SQLITE_IOERR_CHECKRESERVEDLOCK = ErrorCode(C.SQLITE_IOERR_CHECKRESERVEDLOCK)
	SQLITE_IOERR_LOCK              = ErrorCode(C.SQLITE_IOERR_LOCK)
	SQLITE_IOERR_CLOSE             = ErrorCode(C.SQLITE_IOERR_CLOSE)
	SQLITE_IOERR_DIR_CLOSE         = ErrorCode(C.SQLITE_IOERR_DIR_CLOSE)
	SQLITE_IOERR_SHMOPEN           = ErrorCode(C.SQLITE_IOERR_SHMOPEN)
	SQLITE_IOERR_SHMSIZE           = ErrorCode(C.SQLITE_IOERR_SHMSIZE)
	SQLITE_IOERR_SHMLOCK           = ErrorCode(C.SQLITE_IOERR_SHMLOCK)
	SQLITE_IOERR_SHMMAP            = ErrorCode(C.SQLITE_IOERR_SHMMAP)
	SQLITE_IOERR_SEEK              = ErrorCode(C.SQLITE_IOERR_SEEK)
	SQLITE_IOERR_DELETE_NOENT      = ErrorCode(C.SQLITE_IOERR_DELETE_NOENT)
	SQLITE_IOERR_MMAP              = ErrorCode(C.SQLITE_IOERR_MMAP)
	SQLITE_IOERR_GETTEMPPATH       = ErrorCode(C.SQLITE_IOERR_GETTEMPPATH)
	SQLITE_IOERR_CONVPATH          = ErrorCode(C.SQLITE_IOERR_CONVPATH)
	SQLITE_IOERR_VNODE             = ErrorCode(C.SQLITE_IOERR_VNODE)
	SQLITE_IOERR_AUTH              = ErrorCode(C.SQLITE_IOERR_AUTH)
	SQLITE_IOERR_BEGIN_ATOMIC      = ErrorCode(C.SQLITE_IOERR_BEGIN_ATOMIC)
	SQLITE_IOERR_COMMIT_ATOMIC     = ErrorCode(C.SQLITE_IOERR_COMMIT_ATOMIC)
	SQLITE_IOERR_ROLLBACK_ATOMIC   = ErrorCode(C.SQLITE_IOERR_ROLLBACK_ATOMIC)
	SQLITE_LOCKED_SHAREDCACHE      = ErrorCode(C.SQLITE_LOCKED_SHAREDCACHE)
	SQLITE_BUSY_RECOVERY           = ErrorCode(C.SQLITE_BUSY_RECOVERY)
	SQLITE_BUSY_SNAPSHOT           = ErrorCode(C.SQLITE_BUSY_SNAPSHOT)
	SQLITE_CANTOPEN_NOTEMPDIR      = ErrorCode(C.SQLITE_CANTOPEN_NOTEMPDIR)
	SQLITE_CANTOPEN_ISDIR          = ErrorCode(C.SQLITE_CANTOPEN_ISDIR)
	SQLITE_CANTOPEN_FULLPATH       = ErrorCode(C.SQLITE_CANTOPEN_FULLPATH)
	SQLITE_CANTOPEN_CONVPATH       = ErrorCode(C.SQLITE_CANTOPEN_CONVPATH)
	SQLITE_CORRUPT_VTAB            = ErrorCode(C.SQLITE_CORRUPT_VTAB)
	SQLITE_READONLY_RECOVERY       = ErrorCode(C.SQLITE_READONLY_RECOVERY)
	SQLITE_READONLY_CANTLOCK       = ErrorCode(C.SQLITE_READONLY_CANTLOCK)
	SQLITE_READONLY_ROLLBACK       = ErrorCode(C.SQLITE_READONLY_ROLLBACK)
	SQLITE_READONLY_DBMOVED        = ErrorCode(C.SQLITE_READONLY_DBMOVED)
	SQLITE_READONLY_CANTINIT       = ErrorCode(C.SQLITE_READONLY_CANTINIT)
	SQLITE_READONLY_DIRECTORY      = ErrorCode(C.SQLITE_READONLY_DIRECTORY)
	SQLITE_ABORT_ROLLBACK          = ErrorCode(C.SQLITE_ABORT_ROLLBACK)
	SQLITE_CONSTRAINT_CHECK        = ErrorCode(C.SQLITE_CONSTRAINT_CHECK)
	SQLITE_CONSTRAINT_COMMITHOOK   = ErrorCode(C.SQLITE_CONSTRAINT_COMMITHOOK)
	SQLITE_CONSTRAINT_FOREIGNKEY   = ErrorCode(C.SQLITE_CONSTRAINT_FOREIGNKEY)
	SQLITE_CONSTRAINT_FUNCTION     = ErrorCode(C.SQLITE_CONSTRAINT_FUNCTION)
	SQLITE_CONSTRAINT_NOTNULL      = ErrorCode(C.SQLITE_CONSTRAINT_NOTNULL)
	SQLITE_CONSTRAINT_PRIMARYKEY   = ErrorCode(C.SQLITE_CONSTRAINT_PRIMARYKEY)
	SQLITE_CONSTRAINT_TRIGGER      = ErrorCode(C.SQLITE_CONSTRAINT_TRIGGER)
	SQLITE_CONSTRAINT_UNIQUE       = ErrorCode(C.SQLITE_CONSTRAINT_UNIQUE)
	SQLITE_CONSTRAINT_VTAB         = ErrorCode(C.SQLITE_CONSTRAINT_VTAB)
	SQLITE_CONSTRAINT_ROWID        = ErrorCode(C.SQLITE_CONSTRAINT_ROWID)
	SQLITE_NOTICE_RECOVER_WAL      = ErrorCode(C.SQLITE_NOTICE_RECOVER_WAL)
	SQLITE_NOTICE_RECOVER_ROLLBACK = ErrorCode(C.SQLITE_NOTICE_RECOVER_ROLLBACK)
	SQLITE_WARNING_AUTOINDEX       = ErrorCode(C.SQLITE_WARNING_AUTOINDEX)
	SQLITE_AUTH_USER               = ErrorCode(C.SQLITE_AUTH_USER)
)

type causer interface {
	Cause() error
}

// ErrCode extracts the SQLite error code from err.
// If err is not a sqlite Error, SQLITE_ERROR is returned.
// If err is nil, SQLITE_OK is returned.
//
// This function supports wrapped errors that implement
//
//	interface { Cause() error }
//
// for errors from packages like https://github.com/pkg/errors
func ErrCode(err error) ErrorCode {
	if err != nil {
		if ce, ok := err.(causer); ok {
			return ErrCode(ce.Cause())
		}

		if err, isError := err.(Error); isError {
			return err.Code
		}

		var cerr Error
		if errors.As(err, &cerr) {
			return cerr.Code
		}

		return SQLITE_ERROR
	}
	return SQLITE_OK
}

func itoa(buf []byte, val int64) []byte {
	i := len(buf) - 1
	neg := false
	if val < 0 {
		neg = true
		val = 0 - val
	}
	for val >= 10 {
		buf[i] = byte(val%10 + '0')
		i--
		val /= 10
	}
	buf[i] = byte(val + '0')
	if neg {
		i--
		buf[i] = '-'
	}
	return buf[i:]
}
