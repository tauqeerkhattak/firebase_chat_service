import * as admin from "firebase-admin";
const maxBatchSize = 498;
const db = admin.firestore();

export class PaginatedBatch {
  private batches = [db.batch()];
  private currentBatchOperationsCount = 0;

  public checkBatchSize(): void {
    if (this.currentBatchOperationsCount > maxBatchSize) {
      this.batches.push(db.batch());
      this.currentBatchOperationsCount = 0;
    }
  }


  // TODO: Set DocumentReferenceType
  public set(setParams: {
    document: any,
    data: any,
  }): void {
    this.checkBatchSize();
    this.batches[this.batches.length - 1].set(
        setParams.document, setParams.data,
    );
    this.currentBatchOperationsCount++;
  }

  public update(document: any, data: any): void {
    this.checkBatchSize();
    this.batches[this.batches.length - 1].update(document, data);
    this.currentBatchOperationsCount++;
  }

  public delete(document: any): void {
    this.checkBatchSize();
    this.batches[this.batches.length - 1].delete(document);
    this.currentBatchOperationsCount++;
  }

  public async commit(): Promise<void> {
    for (const batch of this.batches) {
      await batch.commit();
    }
  }
}
