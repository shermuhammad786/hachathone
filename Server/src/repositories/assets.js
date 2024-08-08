import { AssetModel } from "../models/assets.model"

class AssetsRepository {
    AssetById = async (id: any) => {
        const assets = await AssetModel.findById(id);
        return assets
    }
    AssetByName = async (name: any) => {
        const assets = await AssetModel.findOne({ assetName: name });
        return assets
    }

}

export { AssetsRepository }