const concurrency = 4;

interface QueueItem {
	priority: number;
	run: () => void;
}

const pending: QueueItem[] = [];
let active = 0;

function schedule() {
	while (active < concurrency && pending.length > 0) {
		pending.sort((a, b) => a.priority - b.priority);
		const next = pending.shift()!;
		active++;
		next.run();
	}
}

export function enqueue<T>(priority: number, task: () => Promise<T>): Promise<T> {
	return new Promise((resolve, reject) => {
		pending.push({
			priority,
			run: () => {
				task()
					.then(resolve, reject)
					.finally(() => {
						active--;
						schedule();
					});
			},
		});
		schedule();
	});
}
