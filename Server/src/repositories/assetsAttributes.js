import { AssetAttributesModel } from "../models/asset.attributes.model";

class AssetsRepository {
    findAssetAttributesById = async (id: any) => {
        const assets = await AssetAttributesModel.findById(id);
        return assets
    }
    findAssetAttributesByName = async (name: any) => {
        const assets = await AssetAttributesModel.findOne({ assetName: name });
        return assets
    }

}

export { AssetsRepository }