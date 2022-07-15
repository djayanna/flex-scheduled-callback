USE master;
GO

IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'CallbackScheduler')
  BEGIN
    CREATE DATABASE [CallbackScheduler]
  END
GO


USE [CallbackScheduler]
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[Callback]') AND type in (N'U'))

BEGIN

CREATE TABLE [dbo].[Callback](
	[Id] UNIQUEIDENTIFIER PRIMARY KEY default NEWID(),
	[FirstName] [nvarchar](50) NULL,
	[LastName] [nvarchar](50) NULL,
	[PhoneNumber] [nvarchar](15) NOT NULL,
	[Date] [datetime] NULL,
	[Notes] [nvarchar](200) NULL,
	[AutoDial] [bit] NULL,
	[RouteToQueue] [bit] NULL,
	[WorkerSid] [nvarchar](50) NULL,
	[WorkerName] [nvarchar](50) NULL,
	[TaskSid] [nvarchar](50) NULL,
	[CompletedBy] [nvarchar](50) NULL,
	[CompletedDateTime] [datetime] NULL,
	[OutboundTaskSid] [nvarchar](50) NULL,
	[OutboundCallSid] [nvarchar](50) NULL,
	[Deleted] [bit] NOT NULL default(0)
) ON [PRIMARY]

END

GO
CREATE NONCLUSTERED INDEX [NonClusteredIndex-20220621-020059] ON [dbo].[Callback]
(
	[Date] ASC,
	[Time] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [NonClusteredIndex-20220621-020202] ON [dbo].[Callback]
(
	[WorkerSid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO