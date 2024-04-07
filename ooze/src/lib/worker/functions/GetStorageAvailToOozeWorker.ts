// To prevent cache and internal DB using up too much space, we provide these details in the settings

export default async function GetStorageAvailToOozeWorker(): Promise<{
    quota: number | undefined;
    used: number | undefined;
}> {
    const quotaQuery = await navigator.storage.estimate();
    const { quota, usage } = quotaQuery;
    return { quota: quota, used: usage };
}