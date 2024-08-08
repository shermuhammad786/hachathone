import mongoose, { Schema, Document, Date } from 'mongoose';
import bcrypt from 'bcrypt';



const UserSchema = new Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  activeStatus: { type: Boolean, default: true },
  roleId: { type: String, required: true, ref: "RoleTable" },
  lastLogin: { type: Date, default: Date.now },
  timezone: { type: String, }
},
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.log(err);
  }
});

UserSchema.methods.login = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const UserModel = mongoose.model('User', UserSchema);
