<?php
// src/Scheduler/InvoicesScheduler.php

namespace App\Scheduler;

use App\Message\SendInvoicesMessage;
use Symfony\Component\Scheduler\Schedule;
use Symfony\Component\Scheduler\Attribute\AsSchedule;
use Symfony\Component\Scheduler\RecurringMessage;
use Symfony\Component\Scheduler\ScheduleProviderInterface;


#[AsSchedule('default')]
class InvoicesScheduler implements ScheduleProviderInterface
{
    public function getSchedule(): Schedule
	{
		return (new Schedule())->add(
			//RecurringMessage::every('3 seconds', new SendInvoicesMessage()));
			RecurringMessage::every('first Saturday of next week', new SendInvoicesMessage()));
	}
}
